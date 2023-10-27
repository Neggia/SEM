import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';

@Injectable()
export class SemOpenaiCompletionsService {
  constructor(
    @InjectRepository(SemOpenaiCompletions)
    private readonly semOpenaiCompletionsRepository: Repository<SemOpenaiCompletions>,
  ) {}

  findAll(): Promise<SemOpenaiCompletions[]> {
    return this.semOpenaiCompletionsRepository.find();
  }

  async findOne(id: number): Promise<SemOpenaiCompletions> {
    return this.semOpenaiCompletionsRepository.findOne({ where: { id } });
  }
}
