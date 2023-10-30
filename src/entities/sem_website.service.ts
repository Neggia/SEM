import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

@Injectable()
export class SemWebsiteService {
  constructor(
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
  ) {}

  findAll(): Promise<SemWebsite[]> {
    return this.semWebsiteRepository.find();
  }

  async findOne(id: number): Promise<SemWebsite> {
    return this.semWebsiteRepository.findOne({ where: { id } });
  }
}
