import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';
import { SemOpenaiCompletions } from './sem_openai_completions.entity';
import { SemOpenaiCompletionsService } from './sem_openai_completions.service';
import { SemWebsite } from './sem_website.entity';
import { SemWebsiteService } from './sem_website.service';

// Should match client\src\components\TaskView.js const addRow = () => {...
// class HtmlElementStructureSaveObjectDto {
//   id: number;
//   selector: string;
//   type: number;
//   json: string;
//   openai_completions_id: number;
//   website_id: number;
// }

// export class SemHtmlElementStructureDto {
//   saveObjects: HtmlElementStructureSaveObjectDto[];
//   // deleteIds: number[]; // Obejcts to delete from ids
// }

@Injectable()
export class SemHtmlElementStructureService {
  constructor(
    @InjectRepository(SemHtmlElementStructure)
    private readonly semHtmlElementStructureRepository: Repository<SemHtmlElementStructure>,
    @Inject(forwardRef(() => SemWebsiteService))
    private readonly semWebsiteService: SemWebsiteService,
    private readonly semOpenaiCompletionsService: SemOpenaiCompletionsService,
  ) {}

  findAll(type: number): Promise<SemHtmlElementStructure[]> {
    return this.semHtmlElementStructureRepository.find({
      where: {
        type: type,
      },
      relations: ['website', 'openaiCompletions'],
    });
  }

  async findOne(id: number): Promise<SemHtmlElementStructure> {
    return this.semHtmlElementStructureRepository.findOne({
      where: { id },
      relations: ['website', 'openaiCompletions'],
    });
  }

  // async findOneByCompletionsId(
  //   openaiCompletionsId: number,
  // ): Promise<SemHtmlElementStructure> {
  //   return this.semProductJSONRepository.findOne({
  //     where: {
  //       openai_completions_id: openaiCompletionsId,
  //     },
  //   });
  // }

  async findOneBy(
    // openaiCompletionsId: number,
    website: SemWebsite,
    // groupId: number,
    selector: string,
  ): Promise<SemHtmlElementStructure> {
    // const websiteId = website.id;

    console.log('SemHtmlElementStructureService findOneBy');

    return this.semHtmlElementStructureRepository.findOne({
      where: {
        // openai_completions_id: openaiCompletionsId,
        website: website,
        // group_id: groupId,
        selector: selector,
      },
    });
  }

  async findOneByWebsiteAndType(
    website: SemWebsite,
    type: number,
  ): Promise<SemHtmlElementStructure> {
    // const websiteId = website.id;

    return this.semHtmlElementStructureRepository.findOne({
      where: {
        // openai_completions_id: openaiCompletionsId,
        website: website,
        type: type,
      },
    });
  }

  async createHtmlElementStructure(
    website: SemWebsite,
    // groupId: number,
    selector: string,
    type: number,
    json: string,
    openaiCompletions: SemOpenaiCompletions,
  ): Promise<SemHtmlElementStructure> {
    const newHtmlElementStructure =
      this.semHtmlElementStructureRepository.create({
        website: website,
        // group_id: groupId,
        selector: selector,
        json: json,
        type: type,
        openaiCompletions: openaiCompletions,
      });
    await this.semHtmlElementStructureRepository.save(newHtmlElementStructure);
    return newHtmlElementStructure;
  }

  async saveFromJSON(json: string) {
    try {
      const data = JSON.parse(json);
      console.log('saveFromJSON data: ', data);
      // console.log('saveFromJSON data.id: ', data.id);

      const htmlElementStructure =
        await this.semHtmlElementStructureRepository.findOne({
          where: { id: data.id },
        });
      if (
        htmlElementStructure.selector !== data.selector ||
        htmlElementStructure.json !== data.json
      ) {
        htmlElementStructure.selector = data.selector;
        htmlElementStructure.json = data.json;
        console.log(
          'saveFromJSON htmlElementStructure: ',
          htmlElementStructure,
        );
        await this.semHtmlElementStructureRepository.save(htmlElementStructure);
      }
    } catch (error) {
      console.error(`Failed to saveFromJSON: ${json}`, error);
      throw new Error(error);
    }
  }

  /*   async sync(htmlElementStructureDto: SemHtmlElementStructureDto) {
    // let deleteIds = websiteDto.deleteIds;

    // Handling saveObjects
    if (htmlElementStructureDto.saveObjects.length > 0) {
      for (const object of htmlElementStructureDto.saveObjects) {
        // Records that are in saveObjects must not be deleted
        // deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

        console.log('SemHtmlElementStructureService sync object: ', object);

        let htmlElementStructure = new SemHtmlElementStructure();
        htmlElementStructure = { ...htmlElementStructure, ...object };

        // Set the website relation using the website ID
        if (object.website_id) {
          htmlElementStructure.website = await this.semWebsiteService.findOne(
            object.website_id,
          );
        }
        // console.log('SemWebsiteService sync website: ', htmlElementStructure.website);

        if (object.openai_completions_id) {
          htmlElementStructure.openaiCompletions =
            await this.semOpenaiCompletionsService.findOne(
              object.openai_completions_id,
            );
        }

        console.log(
          'SemHtmlElementStructureService sync htmlElementStructure: ',
          htmlElementStructure,
        );
        await this.semHtmlElementStructureRepository.save(htmlElementStructure);
      }
    }

    // Handling deleteIds
    // if (deleteIds.length > 0) {
    //   for (const deleteId of deleteIds) {
    //     // Check if the record exists
    //     const website = await this.findOne(deleteId);

    //     if (website) {
    //       // If the record exists, delete it
    //       await this.semWebsiteRepository.delete(deleteId);
    //     }
    //   }
    // }
  } */

  // async clearTableData(): Promise<void> {
  //   await this.semHtmlElementStructure.clear();
  // }
}
