import { Injectable, Logger } from '@nestjs/common';
import { SemHtmlElementService } from '../entities/sem_html_element.service';

@Injectable()
export class ServiceOpenaiService {
  private readonly logger = new Logger(ServiceOpenaiService.name);

  constructor(
    private readonly semHtmlElementService: SemHtmlElementService,
  ) {}

  async getProductJSON(url: string): Promise<any> {
    try {
        const htmlElements = await this.semHtmlElementService.findAll();
        console.log('ServiceOpenaiService.getProductJSON() htmlElements: ', htmlElements);
    } catch (error) {
      this.logger.error(`Failed to get product JSON: ${url}`, error.stack);
      throw new Error(`Failed to get product JSON: ${url}`);
    }
  }
}
