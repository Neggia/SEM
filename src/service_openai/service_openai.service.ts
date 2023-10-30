import { Injectable, Logger } from '@nestjs/common';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';
import { SemWebsiteService } from '../entities/sem_website.service';
import { SemProductJSONService } from '../entities/sem_product_json.service';
// https://platform.openai.com/docs/guides/gpt/chat-completions-api?lang=node.js
import { ClientOptions, OpenAI } from 'openai';

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
    private readonly semOpenaiCompletionsService: SemOpenaiCompletionsService,
    private readonly semWebsiteService: SemWebsiteService,
    private readonly semProductJSONService: SemProductJSONService,
  ) {}

  async getProductJSON(htmlElementId: number): Promise<number> {
    try {
      const htmlElement =
        await this.semHtmlElementService.findOne(htmlElementId);
      const website = await this.semWebsiteService.findOne(htmlElementId);

      const parseHtmlElementReply = await this.parseHtmlElement(
        htmlElement.content,
        website.openai_completions_id,
      );
      const parseHtmlElementReplyJSON = JSON.parse(parseHtmlElementReply); // Checks if it is a valid JSON
      const productJSON = await this.semProductJSONService.createProductJSON(
        htmlElement.website_id,
        htmlElement.group_id,
        parseHtmlElementReply,
      );
      console.log(
        'ServiceOpenaiService.getProductJSON() productJSON: ',
        productJSON,
      );

      return productJSON.id;
    } catch (error) {
      this.logger.error(
        `Failed to get product JSON for HTML element id: ${htmlElementId}`,
        error.stack,
      );
      throw new Error(
        `Failed to get product JSON for HTML element id: ${htmlElementId}`,
      );
    }
  }

  async parseHtmlElement(
    htmlElement: string,
    completionsId: number,
  ): Promise<string> {
    try {
      const completions =
        await this.semOpenaiCompletionsService.findOne(completionsId);
      console.log(
        'ServiceOpenaiService.parseHtmlElement() completions: ',
        completions,
      );
      const completionsJSON = JSON.parse(completions.json);
      console.log(
        'ServiceOpenaiService.parseHtmlElement() completionsJSON: ',
        completionsJSON,
      );
      const userMessageIndex = completionsJSON.messages.findIndex(
        (item) => item.role === 'user',
      );
      if (userMessageIndex !== -1) {
        completionsJSON.messages[userMessageIndex].content =
          completionsJSON.messages[userMessageIndex].content.replace(
            '<html_element>',
            htmlElement,
          );
        console.log('Updated completionsJSON: ', completionsJSON);
      }

      // The system message helps set the behavior of the assistant
      const completion = await openai.chat.completions.create({
        messages: completionsJSON.messages,
        // messages: [
        //   { role: 'system', content: 'You are a helpful assistant.' },
        //   { role: 'user', content: 'Tell me the result of 2 x 2' },
        // ],
        model: completionsJSON.model, //"gpt-3.5-turbo",
      });
      console.log('parseHtmlElement() completion: ', completion);
      const reply: string = completion.choices[0].message.content;
      console.log('parseHtmlElement() reply: ', reply);

      return reply;
    } catch (error) {
      this.logger.error(
        `Failed to parse HTML element: ${htmlElement}`,
        error.stack,
      );
      throw new Error(`Failed to parse HTML element: ${htmlElement}`);
    }
  }
}
