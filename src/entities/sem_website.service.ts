import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';
import { copyExistingFields } from '../utils/globals';
import { SemProcess } from '../entities/sem_process.entity';
import { SemProcessService } from './sem_process.service';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';
import {
  SemHtmlElementStructureService,
  // SemHtmlElementStructureDto,
} from './sem_html_element_structure.service';
import { SemOpenaiCompletionsService } from './sem_openai_completions.service';
const {
  // HTML_ELEMENT_TYPE_UNKNOWN,
  HTML_ELEMENT_TYPE_PRODUCT,
  // HTML_ELEMENT_TYPE_CATEGORY,
  // HTML_ELEMENT_TYPE_PAGINATION,
} = require('../../client/src/utils/globals');

// Should match client\src\components\TaskView.js const addRow = () => {...
class TaskSaveObjectDto {
  id: number;
  pid: number;
  name: string;
  url: string;
  last_start: number;
  num_pages: number;
  last_page: number;
  status: number;
  progress: null;
  product_structure: string;
}

// class ProductStructureDto {
//   id: number;
//   selector: string;
//   type: number;
//   json: string;
//   openai_completions_id: number;
//   website_id: number;
// }

export class SemWebsiteDto {
  saveObjects: TaskSaveObjectDto[];
  //SemWebsite[]; // Obejects to create or update with save
  // productStructures: SemHtmlElementStructureDto;
  deleteIds: number[]; // Obejcts to delete from ids
}

@Injectable()
export class SemWebsiteService {
  constructor(
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
    private readonly semProcessService: SemProcessService,
    @Inject(forwardRef(() => SemHtmlElementStructureService))
    private readonly semHtmlElementStructureService: SemHtmlElementStructureService,
    private readonly semOpenaiCompletionsService: SemOpenaiCompletionsService,
  ) {}

  findAll(): Promise<SemWebsite[]> {
    return this.semWebsiteRepository.find({
      relations: [
        'process',
        // 'htmlElements',
        // 'products',
        // 'htmlElementStructures',
      ],
    });
  }

  async findOne(id: number, relations: string[] = []): Promise<SemWebsite> {
    if (relations.length === 0) {
      relations = [
        'process',
        // 'htmlElements',
        // 'products',
        // 'htmlElementStructures',
      ];
    }

    return this.semWebsiteRepository.findOne({
      where: { id },
      relations: relations,
    });
  }

  async updateWebsiteField(
    // website: SemWebsite,
    websiteId: number,
    fieldName: string,
    newValue: any,
  ): Promise<SemWebsite> {
    const website = await this.findOne(websiteId);

    website[fieldName] = newValue; // Update the field
    await this.semWebsiteRepository.save(website); // Save the updated process

    return website;
  }

  async sync(websiteDto: SemWebsiteDto) {
    let deleteIds = websiteDto.deleteIds;

    // Handling saveObjects
    if (websiteDto.saveObjects.length > 0) {
      for (const object of websiteDto.saveObjects) {
        let website = await this.findOne(object.id);

        try {
          if (website) {
            await this.updateWebsiteField(website.id, 'message', '');
          }

          // Records that are in saveObjects must not be deleted
          deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

          console.log('SemWebsiteService sync object: ', object);

          if (!website) {
            website = new SemWebsite();
            // Set the process relation using the process ID (pid)
            if (object.pid) {
              website.process = await this.semProcessService.findOne(
                object.pid,
              );
            }
          }
          website = { ...website, ...object };

          console.log('SemWebsiteService sync website: ', website);

          await this.semWebsiteRepository.save(website);

          if (object.product_structure) {
            // TODO Update if openaiCompletions can be added for specific websites
            const getProductStructureOpenaiCompletions =
              await this.semOpenaiCompletionsService.findOne(1); // getProductStructure

            await await this.semHtmlElementStructureService.saveFromJSON(
              object.product_structure,
              HTML_ELEMENT_TYPE_PRODUCT,
              website,
              getProductStructureOpenaiCompletions,
            );
          }
        } catch (error) {
          // console.error(`Failed to crawl: ${url}`, error);

          // Update the existing websiteLazy object instead of reassigning it
          // const website = await this.findOne(object.id);
          // if (website) {
          //   Object.assign(websiteLazy, website);
          // }

          const message: string = error.message;
          if (website) {
            await this.updateWebsiteField(website.id, 'message', message);
          }
        }
      }
    }

    // await this.semHtmlElementStructureService.sync(
    //   websiteDto.productStructures,
    // );

    // if (websiteDto.productStructures.length > 0) {
    //   for (const object of websiteDto.productStructures) {
    //     console.log('SemWebsiteService sync productStructure: ', object);

    //     let htmlElementStructure = new SemHtmlElementStructure();
    //     htmlElementStructure = { ...htmlElementStructure, ...object };

    //     // Set the process relation using the process ID (pid)
    //     if (object.website_id) {
    //       htmlElementStructure.website =
    //         await this.semWebsiteRepository.findOne(object.website_id);
    //     }
    //     console.log('SemWebsiteService sync website: ', website);

    //     await this.semHtmlElementStructureService.sync(htmlElementStructure);
    //   }
    // }

    // Handling deleteIds
    if (deleteIds.length > 0) {
      for (const deleteId of deleteIds) {
        // Check if the record exists
        const website = await this.findOne(deleteId);

        if (website) {
          // If the record exists, delete it
          await this.semWebsiteRepository.delete(deleteId);
        }
      }
    }
  }
}
