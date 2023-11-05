import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { SemHtmlElementStructureFixtures } from '../fixtures/sem_html_element_structure.fixtures';
// import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementFixtures } from '../fixtures/sem_html_element.fixtures';
// import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsFixtures } from '../fixtures/sem_openai_completions.fixtures';
// import { SemProcess } from '../entities/sem_process.entity';
import { SemProcessFixtures } from '../fixtures/sem_process.fixtures';
// import { SemWebsite } from '../entities/sem_website.entity';
import { SemWebsiteFixtures } from '../fixtures/sem_website.fixtures';
import { EntityManager, EntityTarget } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

export interface Fixture {
  entityType: EntityTarget<any>;
  data: any[];
  relations?: string[];
}

@Injectable()
export class FixturesService {
  private entityMap = new Map<number, any>();

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager, // inject other dependencies if needed
  ) {}

  private async clearData() {
    // Add logic here to clear existing data if necessary
    // Ensure you clear data in the right order to respect foreign key constraints
  }

  async loadFixtures(): Promise<void> {
    await this.clearData();
    await this.loadEntities(SemProcessFixtures);
    await this.loadEntities(SemWebsiteFixtures);
    await this.loadEntities(SemHtmlElementFixtures);

    await this.loadEntities(SemOpenaiCompletionsFixtures);
    await this.loadEntities(SemHtmlElementStructureFixtures);
    // add other entities as needed, making sure to load dependencies first
  }

  private async loadEntities(fixture: Fixture): Promise<void> {
    const repository = this.entityManager.getRepository(fixture.entityType);

    for (const data of fixture.data) {
      const entity = repository.create(data);

      if (fixture.relations) {
        for (const relation of fixture.relations) {
          if (data[relation]) {
            entity[relation] = data[relation].map((id) =>
              this.entityMap.get(id),
            );
          }
        }
      }

      const savedEntity = await repository.save(entity);
      this.entityMap.set(savedEntity.id, savedEntity);
    }
  }
}

/* @Injectable()
export class FixturesService {
  private readonly repositories: Array<Repository<any>>;

  constructor(
    @InjectRepository(SemHtmlElement)
    private readonly semHtmlElementRepository: Repository<SemHtmlElement>,
    @InjectRepository(SemOpenaiCompletions)
    private readonly semOpenaiCompletionsRepository: Repository<SemOpenaiCompletions>,
    @InjectRepository(SemProcess)
    private readonly semProcessRepository: Repository<SemProcess>,
    @InjectRepository(SemWebsite)
    private readonly semWebsiteRepository: Repository<SemWebsite>,
  ) {
    this.repositories = [
      this.semHtmlElementRepository,
      this.semOpenaiCompletionsRepository,
      this.semProcessRepository,
      this.semWebsiteRepository,
    ];
  }

  async loadFixtures(): Promise<void> {
    const fixtures = [
      SemHtmlElementFixtures,
      SemOpenaiCompletionsFixtures,
      SemProcessFixtures,
      SemWebsiteFixtures,
    ];

    for (let i = 0; i < this.repositories.length; i++) {
      for (const fixture of fixtures[i]) {
        const entity = this.repositories[i].create(fixture);
        await this.repositories[i].save(entity);
      }
    }
  }
} */
