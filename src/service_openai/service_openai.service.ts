import { Injectable, Logger } from '@nestjs/common';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';
import { SemWebsiteService } from '../entities/sem_website.service';
import { SemHtmlElementStructure } from '../entities/sem_html_element_structure.entity';
import { SemHtmlElementStructureService } from '../entities/sem_html_element_structure.service';
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
    private readonly semProductJSONService: SemHtmlElementStructureService,
  ) {}

  async isProduct(
    htmlElementId: number,
    htmlElement?: SemHtmlElement,
  ): Promise<boolean> {
    try {
      if (htmlElement === undefined) {
        htmlElement = await this.semHtmlElementService.findOne(htmlElementId);
      }

      const completions =
        await this.semOpenaiCompletionsService.findNarrowestOneBy(
          'isProduct',
          0, //htmlElement.website_id, // TODO use relations
          htmlElement.group_id,
        );

      const parseHtmlElementResponse = await this.parseHtmlElement(
        htmlElement.content,
        completions,
      );

      return Boolean(parseHtmlElementResponse);
    } catch (error) {
      this.logger.error(
        `Failed to identify product for HTML element id: ${htmlElement.id}`,
        error.stack,
      );
      throw new Error(
        `Failed to identify product for HTML element id: ${htmlElement.id}`,
      );
    }
  }

  async getProduct(
    htmlElementId: number,
    htmlElement?: SemHtmlElement,
  ): Promise<SemHtmlElementStructure> {
    try {
      if (htmlElement === undefined) {
        htmlElement = await this.semHtmlElementService.findOne(htmlElementId);
      }

      // const website = await this.semWebsiteService.findOne(
      //   htmlElement.website_id,
      // );
      const completions =
        await this.semOpenaiCompletionsService.findNarrowestOneBy(
          'getProductJSON',
          0, //htmlElement.website_id, // TODO use relations
          htmlElement.group_id,
        );
      if (completions === undefined) {
        throw new Error(
          `Completions not found for getProductJSON website_id ${
            0 //htmlElement.website_id, // TODO use relations
          } group_id ${htmlElement.group_id}`,
        );
      }
      let productJSON: SemHtmlElementStructure;
      productJSON = await this.semProductJSONService.findOneBy(
        completions.id,
        0, //htmlElement.website_id, // TODO use relations
        htmlElement.group_id,
      );
      if (productJSON) {
        return productJSON;
      }
      // for (const completion of completions) {
      //   const parseCompletionsParametersJSON = JSON.parse(
      //     completion.parameters,
      //   );
      //   const htmlElement = parseCompletionsParametersJSON['<html_element>'];
      //   if (htmlElement === htmlElement.content) {
      //     // Already parsed
      //     const productJSON =
      //       await this.semProductJSONService.findByCompletionsId(completion.id);
      //     if (productJSON === undefined) {
      //       throw new Error(
      //         `SemProductJSON not found for openai_completions_id ${completion.id}`,
      //       );
      //     }
      //     return productJSON;
      //   }
      // }

      const parseHtmlElementResponse = await this.parseHtmlElement(
        htmlElement.content,
        completions,
      );
      const parseHtmlElementResponseJSON = JSON.parse(parseHtmlElementResponse); // Checks if it is a valid JSON
      productJSON = await this.semProductJSONService.createProductJSON(
        completions.id,
        0, //htmlElement.website_id, // TODO use relations
        htmlElement.group_id,
        parseHtmlElementResponse,
      );
      console.log(
        'ServiceOpenaiService.getProductJSON() productJSON: ',
        productJSON,
      );

      return productJSON;
    } catch (error) {
      this.logger.error(
        `Failed to get product JSON for HTML element id: ${htmlElement.id}`,
        error.stack,
      );
      throw new Error(
        `Failed to get product JSON for HTML element id: ${htmlElement.id}`,
      );
    }
  }

  async parseHtmlElement(
    htmlElement: string,
    completions: SemOpenaiCompletions,
    // completionsId: number,
  ): Promise<string> {
    try {
      // const completions =
      //   await this.semOpenaiCompletionsService.findOne(completionsId);
      // console.log(
      //   'ServiceOpenaiService.parseHtmlElement() completions: ',
      //   completions,
      // );
      const completionsJSON = JSON.parse(completions.body);
      console.log(
        'ServiceOpenaiService.parseHtmlElement() completionsJSON: ',
        completionsJSON,
      );
      const completionsMessageIndex = completionsJSON.messages.findIndex(
        (item) => item.role === 'user',
      );
      if (completionsMessageIndex !== -1) {
        completionsJSON.messages[completionsMessageIndex].content =
          completionsJSON.messages[completionsMessageIndex].content.replace(
            '<html_element>',
            htmlElement,
          );
        console.log('Updated completionsJSON: ', completionsJSON);
      }

      // The system message helps set the behavior of the assistant
      const completionsResponse = await openai.chat.completions.create({
        messages: completionsJSON.messages,
        // messages: [
        //   { role: 'system', content: 'You are a helpful assistant.' },
        //   { role: 'user', content: 'Tell me the result of 2 x 2' },
        // ],
        model: completionsJSON.model, //"gpt-3.5-turbo",
      });
      console.log('parseHtmlElement() completion: ', completionsResponse);
      const reply: string = completionsResponse.choices[0].message.content;
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
