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
    openaiCompletionsId: number,
    website: SemWebsite,
    groupId: number,
  ): Promise<SemHtmlElementStructure> {
    const websiteId = website.id;

    return this.semHtmlElementStructure.findOne({
      where: {
        // openai_completions_id: openaiCompletionsId,
        website_id: websiteId,
        group_id: groupId,
      },
    });
  }

  async findOneByWebsiteAndType(
    website: SemWebsite,
    type: number,
  ): Promise<SemHtmlElementStructure> {
    const websiteId = website.id;

    return this.semHtmlElementStructure.findOne({
      where: {
        // openai_completions_id: openaiCompletionsId,
        website_id: websiteId,
        type: type,
      },
    });
  }

  async createHtmlElementStructure(
    websiteId: number,
    groupId: number,
    type: number,
    json: string,
    openaiCompletions: SemOpenaiCompletions,
  ): Promise<SemHtmlElementStructure> {
    const newHtmlElementStructure = this.semHtmlElementStructure.create({
      website_id: websiteId,
      group_id: groupId,
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
