import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemWebsite } from '../entities/sem_website.entity';

// Should match client\src\components\TaskView.js const addRow = () => {...
class OpenaiCompletionsSaveObjectDto {
  id: number;
  body: string;
}

export class SemOpenaiCompletionsDto {
  saveObjects: OpenaiCompletionsSaveObjectDto[];
  //SemWebsite[]; // Obejects to create or update with save
  // productStructures: SemHtmlElementStructureDto;
  // deleteIds: number[]; // Obejcts to delete from ids
}

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

  // async updateWebsiteField(
  //   openaiCompletionsId: number,
  //   fieldName: string,
  //   newValue: any,
  // ): Promise<SemOpenaiCompletions> {
  //   const openaiCompletions = await this.findOne(openaiCompletionsId);

  //   openaiCompletions[fieldName] = newValue; // Update the field
  //   await this.semOpenaiCompletionsRepository.save(openaiCompletions); // Save the updated process

  //   return openaiCompletions;
  // }

  async sync(openaiCompletionsDto: SemOpenaiCompletionsDto) {
    // let deleteIds = websiteDto.deleteIds;

    // Handling saveObjects
    if (openaiCompletionsDto.saveObjects.length > 0) {
      for (const object of openaiCompletionsDto.saveObjects) {
        let openaiCompletions = await this.findOne(object.id);

        try {
          // await this.updateWebsiteField(openaiCompletions.id, 'message', '');

          // Records that are in saveObjects must not be deleted
          // deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

          console.log('SemWebsiteService sync object: ', object);

          // let website = new SemWebsite();
          openaiCompletions = { ...openaiCompletions, ...object };

          // Test if it's a valid JSON
          const body = JSON.parse(openaiCompletions.body);

          // Set the process relation using the process ID (pid)
          // if (object.pid) {
          //   website.process = await this.semProcessService.findOne(object.pid);
          // }
          console.log(
            'SemWebsiteService sync openaiCompletions: ',
            openaiCompletions,
          );

          await this.semOpenaiCompletionsRepository.save(openaiCompletions);

          // await this.semHtmlElementStructureService.saveFromJSON(
          //   object.product_structure,
          // );
        } catch (error) {
          console.error(`Failed to sync openaiCompletions to db: `, error);
          throw new Error(error);

          // Update the existing websiteLazy object instead of reassigning it
          // const website = await this.findOne(object.id);
          // if (website) {
          //   Object.assign(websiteLazy, website);
          // }

          // const message: string = error.message;
          // await this.updateWebsiteField(website.id, 'message', message);
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
