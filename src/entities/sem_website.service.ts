import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';
import { copyExistingFields } from '../utils/globals';
import { SemProcess } from '../entities/sem_process.entity';
import { SemProcessService } from './sem_process.service';

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
}

export class SemWebsiteDto {
  saveObjects: TaskSaveObjectDto[];
  //SemWebsite[]; // Obejects to create or update with save
  deleteIds: number[]; // Obejcts to delete from ids
}

@Injectable()
export class SemWebsiteService {
  constructor(
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
    private readonly semProcessService: SemProcessService,
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
    website: SemWebsite,
    fieldName: string,
    newValue: any,
  ): Promise<SemWebsite> {
    website[fieldName] = newValue; // Update the field
    await this.semWebsiteRepository.save(website); // Save the updated process

    return website;
  }

  async sync(websiteDto: SemWebsiteDto) {
    let deleteIds = websiteDto.deleteIds;

    // Handling saveObjects
    if (websiteDto.saveObjects.length > 0) {
      for (const object of websiteDto.saveObjects) {
        // Records that are in saveObjects must not be deleted
        deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

        console.log('SemWebsiteService sync object: ', object);

        let website = new SemWebsite();
        website = { ...website, ...object };

        // Set the process relation using the process ID (pid)
        if (object.pid) {
          website.process = await this.semProcessService.findOne(object.pid);
        }
        console.log('SemWebsiteService sync website: ', website);

        await this.semWebsiteRepository.save(website);
      }
    }

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
