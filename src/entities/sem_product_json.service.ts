import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemProductJSON } from '../entities/sem_product_json.entity';

@Injectable()
export class SemProductJSONService {
  constructor(
    @InjectRepository(SemProductJSON)
    private readonly semProductJSONRepository: Repository<SemProductJSON>,
  ) {}

  findAll(): Promise<SemProductJSON[]> {
    return this.semProductJSONRepository.find();
  }

  async findOne(id: number): Promise<SemProductJSON> {
    return this.semProductJSONRepository.findOne({ where: { id } });
  }

  async createProductJSON(
    websiteId: number,
    groupId: number,
    content: string,
  ): Promise<SemProductJSON> {
    const newProductJSON = this.semProductJSONRepository.create({
      website_id: websiteId,
      group_id: groupId,
      content: content,
    });
    await this.semProductJSONRepository.save(newProductJSON);
    return newProductJSON;
  }
}
