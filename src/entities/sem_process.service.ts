import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemProcess } from '../entities/sem_process.entity';

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
}
