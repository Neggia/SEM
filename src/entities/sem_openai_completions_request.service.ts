import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsRequest } from '../entities/sem_openai_completions_request.entity';
import { SemWebsite } from './sem_website.entity';
// import { hashString } from '../utils/globals';

export const OPENAICOMPLETIONS_REQUEST_STATUS_SUCCESS = 0;
export const OPENAICOMPLETIONS_REQUEST_STATUS_ERROR = 1; // 2^0, binary 0001

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
    bodyHash: string,
    openaiCompletions: SemOpenaiCompletions,
    website?: SemWebsite,
  ): Promise<SemOpenaiCompletionsRequest> {
    if (website) {
      return this.semOpenaiCompletionsRequest.findOne({
        where: {
          website_id: website.id,
          bodyHash: bodyHash,
          openaiCompletions: openaiCompletions,
        },
        relations: ['openaiCompletions'],
      });
    } else {
      return this.semOpenaiCompletionsRequest.findOne({
        where: {
          bodyHash: bodyHash,
          openaiCompletions: openaiCompletions,
        },
        relations: ['openaiCompletions'],
      });
    }
  }

  async createOpenaiCompletionsRequest(
    website: SemWebsite,
    bodyHash: string,
    response: string,
    openaiCompletions: SemOpenaiCompletions,
    status: number,
    body?: string,
  ): Promise<SemOpenaiCompletionsRequest> {
    const websiteId = website.id;

    // Create a new instance of SemOpenaiCompletionsRequest
    const openaiCompletionsRequest = new SemOpenaiCompletionsRequest();
    openaiCompletionsRequest.website_id = websiteId;
    openaiCompletionsRequest.bodyHash = bodyHash;
    openaiCompletionsRequest.response = response;
    openaiCompletionsRequest.openaiCompletions = openaiCompletions;
    openaiCompletionsRequest.status = status;
    openaiCompletionsRequest.body = body ? body : null;

    // Save the new SemOpenaiCompletionsRequest in the database
    return await this.semOpenaiCompletionsRequest.save(
      openaiCompletionsRequest,
    );
  }
}
