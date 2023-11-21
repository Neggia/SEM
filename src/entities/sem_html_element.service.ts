import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemWebsite } from '../entities/sem_website.entity';

@Injectable()
export class SemHtmlElementService {
  constructor(
    @InjectRepository(SemHtmlElement)
    private readonly semHtmlElementRepository: Repository<SemHtmlElement>,
  ) {}

  findAll(): Promise<SemHtmlElement[]> {
    return this.semHtmlElementRepository.find({
      relations: ['website'],
    });
  }

  async findOne(id: number): Promise<SemHtmlElement> {
    return this.semHtmlElementRepository.findOne({
      where: { id },
      relations: ['website'],
    });
  }

  async createHtmlElement(
    groupId: number,
    selector: string,
    content: string,
    website: SemWebsite,
  ): Promise<SemHtmlElement> {
    // Create a new instance of SemHtmlElement
    const htmlElement = new SemHtmlElement();
    htmlElement.group_id = groupId;
    htmlElement.selector = selector;
    htmlElement.content = content;
    htmlElement.website = website;

    // Save the new HTML element in the database
    return await this.semHtmlElementRepository.save(htmlElement);
  }

  async deleteHtmlElementsByWebsite(website: SemWebsite): Promise<void> {
    await this.semHtmlElementRepository.delete({ website: website });
  }
}
