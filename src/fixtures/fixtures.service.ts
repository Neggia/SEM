import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemOpenaiCompletionsFixtures } from '../fixtures/sem_openai_completions.fixtures';
import { SemHtmlElementFixtures } from '../fixtures/sem_html_element.fixtures';

@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(SemOpenaiCompletions)
    private readonly SemOpenaiCompletionsRepository: Repository<SemOpenaiCompletions>,
    @InjectRepository(SemHtmlElement)
    private readonly SemHtmlElementRepository: Repository<SemHtmlElement>,
  ) {}

  async loadFixtures(): Promise<void> {
    for (const semOpenaiCompletionsfixture of SemOpenaiCompletionsFixtures) {
      const semOpenaiCompletions = this.SemOpenaiCompletionsRepository.create(
        semOpenaiCompletionsfixture,
      );
      await this.SemOpenaiCompletionsRepository.save(semOpenaiCompletions);
    }

    for (const semHtmlElementfixture of SemHtmlElementFixtures) {
      const semHtmlElement = this.SemHtmlElementRepository.create(
        semHtmlElementfixture,
      );
      await this.SemHtmlElementRepository.save(semHtmlElement);
    }
  }
}
