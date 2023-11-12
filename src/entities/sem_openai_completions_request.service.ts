import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsRequest } from '../entities/sem_openai_completions_request.entity';
import { SemWebsite } from './sem_website.entity';
import { hashString } from '../utils/globals';

@Injectable()
export class SemOpenaiCompletionsRequestService {
  constructor(
    @InjectRepository(SemOpenaiCompletionsRequest)
    private readonly semOpenaiCompletionsRequest: Repository<SemOpenaiCompletionsRequest>,
  ) {}

  findAll(): Promise<SemOpenaiCompletionsRequest[]> {
    return this.semOpenaiCompletionsRequest.find({
      relations: ['openaiCompletions'],
    });
  }

  async findOne(id: number): Promise<SemOpenaiCompletionsRequest> {
    return this.semOpenaiCompletionsRequest.findOne({
      where: { id },
      relations: ['openaiCompletions'],
    });
  }

  async findOneBy(
    website: SemWebsite,
    bodyHash: string,
    openaiCompletions: SemOpenaiCompletions,
  ): Promise<SemOpenaiCompletionsRequest> {
    return this.semOpenaiCompletionsRequest.findOne({
      where: {
        website_id: website.id,
        bodyHash: bodyHash,
        openaiCompletions: openaiCompletions,
      },
      relations: ['openaiCompletions'],
    });
  }

  async createOpenaiCompletionsRequest(
    website: SemWebsite,
    response: string,
    openaiCompletions: SemOpenaiCompletions,
  ): Promise<SemOpenaiCompletionsRequest> {
    const websiteId = website.id;

    // Create a new instance of SemOpenaiCompletionsRequest
    const openaiCompletionsRequest = new SemOpenaiCompletionsRequest();
    openaiCompletionsRequest.website_id = websiteId;
    openaiCompletionsRequest.bodyHash = hashString(openaiCompletions.body);
    openaiCompletionsRequest.response = response;
    openaiCompletionsRequest.openaiCompletions = openaiCompletions;

    // Save the new SemOpenaiCompletionsRequest in the database
    return await this.semOpenaiCompletionsRequest.save(
      openaiCompletionsRequest,
    );
  }
}
