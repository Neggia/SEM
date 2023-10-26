import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElement } from '../entities/sem_html_element.entity';

@Injectable()
export class SemHtmlElementService {
  constructor(
    @InjectRepository(SemHtmlElement)
    private readonly SemHtmlElementRepository: Repository<SemHtmlElement>,
  ) {}

  findAll(): Promise<SemHtmlElement[]> {
    return this.SemHtmlElementRepository.find();
  }

//   async findOne(id: number): Promise<SemHtmlElement> {
//     return this.SemHtmlElementRepository.findOne(id);
//   }
}
