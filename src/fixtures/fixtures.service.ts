import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementFixtures } from '../fixtures/sem_html_element.fixtures';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsFixtures } from '../fixtures/sem_openai_completions.fixtures';
import { SemWebsite } from '../entities/sem_website.entity';
import { SemWebsiteFixtures } from '../fixtures/sem_website.fixtures';

@Injectable()
export class FixturesService {
  private readonly repositories: Array<Repository<any>>;

  constructor(
    @InjectRepository(SemHtmlElement)
    private readonly semHtmlElementRepository: Repository<SemHtmlElement>,
    @InjectRepository(SemOpenaiCompletions)
    private readonly semOpenaiCompletionsRepository: Repository<SemOpenaiCompletions>,
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
  ) {
    this.repositories = [
      this.semHtmlElementRepository,
      this.semOpenaiCompletionsRepository,
      this.semWebsiteRepository,
    ];
  }

  async loadFixtures(): Promise<void> {
    const fixtures = [
      SemHtmlElementFixtures,
      SemOpenaiCompletionsFixtures,
      SemWebsiteFixtures,
    ];

    for (let i = 0; i < this.repositories.length; i++) {
      for (const fixture of fixtures[i]) {
        const entity = this.repositories[i].create(fixture);
        await this.repositories[i].save(entity);
      }
    }
  }
}
