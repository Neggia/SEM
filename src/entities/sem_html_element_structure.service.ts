import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';
import { SemOpenaiCompletions } from './sem_openai_completions.entity';
import { SemWebsite } from './sem_website.entity';

// Should match client\src\components\TaskView.js const addRow = () => {...
class HtmlElementStructureSaveObjectDto {
  id: number;
  // pid: number;
  // name: string;
  // url: string;
  // last_start: number;
  // num_pages: number;
  // last_page: number;
  // status: number;
  // progress: null;
}

export class SemHtmlElementStructureDto {
  saveObjects: HtmlElementStructureSaveObjectDto[];
  // deleteIds: number[]; // Obejcts to delete from ids
}

@Injectable()
export class SemHtmlElementStructureService {
  constructor(
    @InjectRepository(SemHtmlElementStructure)
    private readonly semHtmlElementStructureRepository: Repository<SemHtmlElementStructure>,
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

  async sync(htmlElementStructureDto: SemHtmlElementStructureDto) {
    // let deleteIds = websiteDto.deleteIds;

    // Handling saveObjects
    if (htmlElementStructureDto.saveObjects.length > 0) {
      for (const object of htmlElementStructureDto.saveObjects) {
        // Records that are in saveObjects must not be deleted
        // deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

        console.log('SemHtmlElementStructureService sync object: ', object);

        let htmlElementStructure = new SemHtmlElementStructure();
        htmlElementStructure = { ...htmlElementStructure, ...object };

        // Set the process relation using the process ID (pid)
        // if (object.pid) {
        //   website.process = await this.semProcessService.findOne(object.pid);
        // }
        // console.log('SemWebsiteService sync website: ', website);

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
  }

  // async clearTableData(): Promise<void> {
  //   await this.semHtmlElementStructure.clear();
  // }
}
