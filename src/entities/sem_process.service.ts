import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemProcess } from '../entities/sem_process.entity';
import { DatabaseModule } from 'src/database/database.module';
// const {
//   PROCESS_STATUS_RUNNING,
//   PROCESS_STATUS_PAUSED,
//   PROCESS_STATUS_STOPPED,
//   PROCESS_STATUS_ERROR,
// } = require('../../client/src/utils/globals');

/* export class SemProcessStatus {
  static readonly RUNNING = PROCESS_STATUS_RUNNING; // 2^0, binary 0001
  static readonly PAUSED = PROCESS_STATUS_PAUSED; // 2^1, binary 0010
  static readonly STOPPED = PROCESS_STATUS_STOPPED; // 2^2, binary 0100
  static readonly ERROR = PROCESS_STATUS_ERROR; // 2^3, binary 1000
  // static readonly STATUS_BIT_4 = 8; // 2^3, binary 1000
  // Add more as needed
} */

export class SemProcessDto {
  saveObjects: SemProcess[]; // Obejects to create or update with save
  deleteIds: number[]; // Obejcts to delete from ids
}

@Injectable()
export class SemProcessService {
  constructor(
    @InjectRepository(SemProcess)
    private readonly semProcessRepository: Repository<SemProcess>,
  ) {}

  findAll(): Promise<SemProcess[]> {
    return this.semProcessRepository.find({ relations: ['websites'] });
  }

  async findOne(id: number): Promise<SemProcess> {
    return this.semProcessRepository.findOne({
      where: { id },
      relations: ['websites'],
    });
  }

  async updateProcessField(
    // process: SemProcess,
    processId: number,
    fieldName: string,
    newValue: any,
  ): Promise<SemProcess> {
    const process = await this.findOne(processId);

    process[fieldName] = newValue; // Update the field
    await this.semProcessRepository.save(process); // Save the updated process

    return process;
  }

  async sync(processDto: SemProcessDto) {
    let deleteIds = processDto.deleteIds;

    if (processDto.saveObjects.length > 0) {
      const saveObjectsPromises = processDto.saveObjects.map((object) => {
        // Records that are in saveObjects must not be deleted
        deleteIds = deleteIds.filter((deleteId) => deleteId !== object.id);

        return this.semProcessRepository.save(object);
      });

      await Promise.all(saveObjectsPromises);
    }

    if (deleteIds.length > 0) {
      const deleteIdsPromises = deleteIds.map(async (deleteId) => {
        // Check if the record exists
        const process = await this.findOne(deleteId);

        if (process) {
          // If the record exists, delete it
          return this.semProcessRepository.delete(deleteId);
        } else {
          // If the record does not exist, return null
          return null;
        }
      });

      await Promise.all(deleteIdsPromises);
    }
  }
}
