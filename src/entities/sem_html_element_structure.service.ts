import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';
import { SemOpenaiCompletions } from './sem_openai_completions.entity';
import { SemWebsite } from './sem_website.entity';

@Injectable()
export class SemHtmlElementStructureService {
  constructor(
    @InjectRepository(SemHtmlElementStructure)
    private readonly semHtmlElementStructure: Repository<SemHtmlElementStructure>,
  ) {}

  findAll(): Promise<SemHtmlElementStructure[]> {
    return this.semHtmlElementStructure.find({
      relations: ['openaiCompletions'],
    });
  }

  async findOne(id: number): Promise<SemHtmlElementStructure> {
    return this.semHtmlElementStructure.findOne({
      where: { id },
      relations: ['openaiCompletions'],
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

    return this.semHtmlElementStructure.findOne({
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

    return this.semHtmlElementStructure.findOne({
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
    const newHtmlElementStructure = this.semHtmlElementStructure.create({
      website: website,
      // group_id: groupId,
      selector: selector,
      json: json,
      type: type,
      openaiCompletions: openaiCompletions,
    });
    await this.semHtmlElementStructure.save(newHtmlElementStructure);
    return newHtmlElementStructure;
  }

  // async clearTableData(): Promise<void> {
  //   await this.semHtmlElementStructure.clear();
  // }
}
