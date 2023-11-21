import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemWebsite } from '../entities/sem_website.entity';

@Injectable()
export class SemOpenaiCompletionsService {
  constructor(
    @InjectRepository(SemOpenaiCompletions)
    private readonly semOpenaiCompletionsRepository: Repository<SemOpenaiCompletions>,
  ) {}

  async findDistinctFunctionNames(): Promise<string[]> {
    // Use the query builder to select distinct function names
    const distinctFunctionNames = await this.semOpenaiCompletionsRepository
      .createQueryBuilder('completion')
      .select('DISTINCT(completion.function_name)', 'function_name')
      .orderBy('completion.function_name') // Optional: To get them in order
      .getRawMany();

    // Extract just the function names from the raw results
    return distinctFunctionNames.map((entry) => entry.function_name);
  }

  findAll(): Promise<SemOpenaiCompletions[]> {
    return this.semOpenaiCompletionsRepository.find({
      relations: ['htmlElementStructures', 'openaiCompletionsRequests'],
    });
  }

  async findOne(id: number): Promise<SemOpenaiCompletions> {
    return this.semOpenaiCompletionsRepository.findOne({
      where: { id },
      relations: ['htmlElementStructures', 'openaiCompletionsRequests'],
    });
  }

  async findOneBy(
    functionName: string,
    website?: SemWebsite,
    groupId?: number,
  ): Promise<SemOpenaiCompletions> {
    const websiteId = website?.id;

    const queryBuilder = this.semOpenaiCompletionsRepository
      .createQueryBuilder('completions')
      .where('completions.function_name = :functionName', { functionName });

    if (websiteId !== undefined) {
      queryBuilder.andWhere('completions.website_id = :websiteId', {
        websiteId,
      });

      if (groupId !== undefined) {
        queryBuilder.andWhere('completions.group_id = :groupId', { groupId });
      } else {
        queryBuilder.andWhere('completions.group_id = null');
      }
    } else {
      if (groupId !== undefined) {
        throw new Error(`websiteId must be defined if groupId is defined`);
      }

      queryBuilder.andWhere('completions.website_id IS NULL');
      queryBuilder.andWhere('completions.group_id IS NULL');
    }

    const completions = await queryBuilder.getOne();
    return completions;
  }

  async findNarrowestOneBy(
    functionName: string,
    website: SemWebsite,
    groupId: number,
  ): Promise<SemOpenaiCompletions> {
    let completions: SemOpenaiCompletions;

    completions = await this.findOneBy(functionName, website, groupId);
    console.log('findNarrowestOneBy() completions: ', completions);
    if (completions === null) {
      completions = await this.findOneBy(functionName, website);
      if (completions === null) {
        completions = await this.findOneBy(functionName);
      }
    }

    return completions;
  }

  /*   async findCompletions(
    websiteId: number,
    groupId: number,
  ): Promise<SemOpenaiCompletions[]> {
    return this.semOpenaiCompletionsRepository.find({
      where: {
        website_id: websiteId,
        group_id: groupId,
      },
    });
  } */

  /*   async createCompletions(
    openaiCompletionsId: number,
    // websiteId: number,
    // groupId: number,
    content: string,
  ): Promise<SemProductJSON> {
    const newProductJSON = this.semProductJSONRepository.create({
      openai_completions_id: openaiCompletionsId,
      // website_id: websiteId,
      // group_id: groupId,
      content: content,
    });
    await this.semProductJSONRepository.save(newProductJSON);
    return newProductJSON;
  } */
}
