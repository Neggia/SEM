import { Injectable, Logger } from '@nestjs/common';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';
// https://platform.openai.com/docs/guides/gpt/chat-completions-api?lang=node.js
import { ClientOptions, OpenAI } from "openai";

const clientOptions: ClientOptions = {
  // organization: 'sem', //"org-w9hB1JYytvgitGSx9pzTsfP8",
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(clientOptions);

@Injectable()
export class ServiceOpenaiService {
  private readonly logger = new Logger(ServiceOpenaiService.name);

  constructor(
    private readonly semHtmlElementService: SemHtmlElementService,
    private readonly semOpenaiCompletionsService: SemOpenaiCompletionsService
  ) {}

  async getProductJSON(htmlElement: string): Promise<any> {
    try {
      const htmlElements = await this.semHtmlElementService.findAll();
      console.log('ServiceOpenaiService.getProductJSON() htmlElements: ', htmlElements);
      const completions = await this.semOpenaiCompletionsService.findAll();
      console.log('ServiceOpenaiService.getProductJSON() completions: ', completions);

      // The system message helps set the behavior of the assistant
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
      });
      console.log('getProductJSON() completion: ', completion)
      console.log('getProductJSON() reply: ', completion.choices[0].message.content)

      // The user messages provide requests or comments for the assistant to respond to
    } catch (error) {
      this.logger.error(`Failed to get product JSON from HTML element: ${htmlElement}`, error.stack);
      throw new Error(`Failed to get product JSON from HTML element: ${htmlElement}`);
    }
  }
}
