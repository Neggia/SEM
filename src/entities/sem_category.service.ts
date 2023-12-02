import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemCategory } from '../entities/sem_category.entity';

@Injectable()
export class SemCategoryService {
  constructor(
    @InjectRepository(SemCategory)
    private readonly semCategoryRepository: Repository<SemCategory>,
  ) {}

  findAll(): Promise<SemCategory[]> {
    return this.semCategoryRepository.find();
  }

  async findOne(id: number): Promise<SemCategory> {
    return this.semCategoryRepository.findOne({
      where: { id },
    });
  }
}
