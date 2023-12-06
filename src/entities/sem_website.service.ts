import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

export class SemWebsiteDto {
  saveObjects: SemWebsite[]; // Obejects to create or update with save
  deleteIds: number[]; // Obejcts to delete from ids
}

@Injectable()
export class SemWebsiteService {
  constructor(
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
  ) {}

  findAll(): Promise<SemWebsite[]> {
    return this.semWebsiteRepository.find({
      relations: ['website', 'htmlElements'],
    });
  }

  async findOne(id: number): Promise<SemWebsite> {
    return this.semWebsiteRepository.findOne({
      where: { id },
      relations: ['website', 'htmlElements'],
    });
  }

  async sync(websiteDto: SemWebsiteDto) {
    let deleteIds = websiteDto.deleteIds;

    if (websiteDto.saveObjects.length > 0) {
      const saveObjectsPromises = websiteDto.saveObjects.map((object) => {
        // Records that are in saveObjects must not be deleted
        deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

        return this.semWebsiteRepository.save(object);
      });

      await Promise.all(saveObjectsPromises);
    }

    if (deleteIds.length > 0) {
      const deleteIdsPromises = deleteIds.map(async (deleteId) => {
        // Check if the record exists
        const website = await this.findOne(deleteId);

        if (website) {
          // If the record exists, delete it
          return this.semWebsiteRepository.delete(deleteId);
        } else {
          // If the record does not exist, return null
          return null;
        }
      });

      await Promise.all(deleteIdsPromises);
    }
  }
}
