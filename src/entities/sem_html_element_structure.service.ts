import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';

@Injectable()
export class SemHtmlElementStructureService {
  constructor(
    @InjectRepository(SemHtmlElementStructure)
    private readonly semProductJSONRepository: Repository<SemHtmlElementStructure>,
  ) {}

  findAll(): Promise<SemHtmlElementStructure[]> {
    return this.semProductJSONRepository.find({
      relations: ['openaiCompletions'],
    });
  }

  async findOne(id: number): Promise<SemHtmlElementStructure> {
    return this.semProductJSONRepository.findOne({
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
    websiteId: number,
    groupId: number,
  ): Promise<SemHtmlElementStructure> {
    return this.semProductJSONRepository.findOne({
      where: {
        // openai_completions_id: openaiCompletionsId,
        website_id: websiteId,
        group_id: groupId,
      },
    });
  }

  async createProductJSON(
    openaiCompletionsId: number,
    websiteId: number,
    groupId: number,
    json: string,
  ): Promise<SemHtmlElementStructure> {
    const newProductJSON = this.semProductJSONRepository.create({
      // openai_completions_id: openaiCompletionsId,
      website_id: websiteId,
      group_id: groupId,
      json: json,
    });
    await this.semProductJSONRepository.save(newProductJSON);
    return newProductJSON;
  }
}
