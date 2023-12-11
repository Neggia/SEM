import { Injectable, Logger } from '@nestjs/common';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';
import { SemOpenaiCompletionsRequestService } from '../entities/sem_openai_completions_request.service';
// import { SemWebsiteService } from '../entities/sem_website.service';
import { SemHtmlElementStructure } from '../entities/sem_html_element_structure.entity';
import { SemHtmlElementStructureService } from '../entities/sem_html_element_structure.service';
// https://platform.openai.com/docs/guides/gpt/chat-completions-api?lang=node.js
import { ClientOptions, OpenAI } from 'openai';
import {
  hashString,
  HTML_ELEMENT_TYPE_UNKNOWN,
  HTML_ELEMENT_TYPE_PRODUCT,
  // HTML_ELEMENT_TYPE_CATEGORY,
  HTML_ELEMENT_TYPE_PAGINATION,
} from '../utils/globals';
import { SemWebsite } from 'src/entities/sem_website.entity';

export interface ProductHtmlElementStructure {
  url: string;
  thumbnail: string; // Check if url or data
  title: string;
  description: string;
  price_01: string;
  currency_01: string;
  price_02: string;
  currency_02: string;
}

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
    private readonly semOpenaiCompletionsRequestService: SemOpenaiCompletionsRequestService,
    // private readonly semWebsiteService: SemWebsiteService,
    private readonly semHtmlElementStructureService: SemHtmlElementStructureService,
  ) {}

  async getFunctions() {
    try {
      const fucntions =
        this.semOpenaiCompletionsService.findDistinctFunctionNames();

      return fucntions;
    } catch (error) {
      this.logger.error(`Failed to get openai service functions`, error.stack);
      throw new Error(`Failed to get openai service functions`);
    }
  }

  async getProductCategory(
    productDescription: string,
    website: SemWebsite,
  ): Promise<string> {
    try {
      const completions =
        await this.semOpenaiCompletionsService.findOneBy('getProductCategory');

      return await this.runCompletions(completions, website, {
        placeholder: '<product_description>',
        content: productDescription,
      });
    } catch (error) {
      this.logger.error(`Failed to get openai service functions`, error.stack);
      throw new Error(`Failed to get openai service functions`);
    }
  }

  // Check if it's pagination, product, category, ecc.. used to create a SemHtmlElementStructure record
  async getHtmlElementType(
    htmlElementId: number,
    htmlElement?: SemHtmlElement,
  ): Promise<number> {
    try {
      if (htmlElement === undefined || htmlElement.website === undefined) {
        htmlElement = await this.semHtmlElementService.findOne(htmlElementId);
      }

      const completions =
        await this.semOpenaiCompletionsService.findNarrowestOneBy(
          'getHtmlElementType',
          htmlElement.website,
          htmlElement.group_id,
        );

      if (htmlElement.content == '') {
        return HTML_ELEMENT_TYPE_UNKNOWN;
      }
      const parseHtmlElementResponse = await this.parseHtmlElement(
        htmlElement,
        completions,
      );
      if (isNaN(Number(parseHtmlElementResponse))) {
        return HTML_ELEMENT_TYPE_UNKNOWN;
      }

      return Number(parseHtmlElementResponse);
    } catch (error) {
      this.logger.error(
        `Failed to identify type for HTML element id: ${htmlElement.id}`,
        error.stack,
      );
      // debugger;
      throw new Error(
        `Failed to identify type for HTML element id: ${htmlElement.id}`,
      );
    }
  }

  isValidProductStructure(parseHtmlElementResponse: string): boolean {
    try {
      const parseHtmlElementResponseJSON: ProductHtmlElementStructure =
        JSON.parse(parseHtmlElementResponse);

      if (
        parseHtmlElementResponseJSON.url !== null &&
        parseHtmlElementResponseJSON.title !== null &&
        parseHtmlElementResponseJSON.thumbnail !== null &&
        parseHtmlElementResponseJSON.price_01 !== null &&
        parseHtmlElementResponseJSON.currency_01 !== null
      ) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async getProductStructure(
    htmlElementId: number,
    htmlElement?: SemHtmlElement,
  ): Promise<SemHtmlElementStructure> {
    try {
      if (htmlElement === undefined || htmlElement.website === undefined) {
        htmlElement = await this.semHtmlElementService.findOne(htmlElementId);
      }

      // const website = await this.semWebsiteService.findOne(
      //   htmlElement.website_id,
      // );
      const completions =
        await this.semOpenaiCompletionsService.findNarrowestOneBy(
          'getProductStructure',
          htmlElement.website,
          htmlElement.group_id,
        );
      if (completions === undefined) {
        throw new Error(
          `Completions not found for getProductStructure website_id ${htmlElement.website.id} group_id ${htmlElement.group_id}`,
        );
      }
      let productJSON: SemHtmlElementStructure;
      productJSON = await this.semHtmlElementStructureService.findOneBy(
        // completions.id,
        htmlElement.website,
        // htmlElement.group_id,
        htmlElement.selector,
      );
      if (productJSON) {
        return productJSON;
      }

      const parseHtmlElementResponse = await this.parseHtmlElement(
        htmlElement,
        completions,
      );

      if (!this.isValidProductStructure(parseHtmlElementResponse)) {
        return null;
      }

      productJSON =
        await this.semHtmlElementStructureService.createHtmlElementStructure(
          htmlElement.website,
          // htmlElement.group_id,
          htmlElement.selector,
          HTML_ELEMENT_TYPE_PRODUCT,
          parseHtmlElementResponse,
          completions,
        );
      console.log(
        'ServiceOpenaiService getProductStructure() productJSON: ',
        productJSON,
      );

      return productJSON;
    } catch (error) {
      this.logger.error(
        `Failed to get product JSON for HTML element id: ${htmlElement.id}`,
        error.stack,
      );
      // throw new Error(
      //   `Failed to get product JSON for HTML element id: ${htmlElement.id}`,
      // );
    }
  }

  async getPaginationData(
    htmlElementId: number,
    htmlElement?: SemHtmlElement,
  ): Promise<string> {
    //SemHtmlElementStructure> {
    try {
      if (htmlElement === undefined || htmlElement.website === undefined) {
        htmlElement = await this.semHtmlElementService.findOne(htmlElementId);
      }

      // const website = await this.semWebsiteService.findOne(
      //   htmlElement.website_id,
      // );
      const completions =
        await this.semOpenaiCompletionsService.findNarrowestOneBy(
          'getPaginationData',
          htmlElement.website,
          htmlElement.group_id,
        );
      if (completions === undefined) {
        throw new Error(
          `Completions not found for getPaginationData website_id ${htmlElement.website.id} group_id ${htmlElement.group_id}`,
        );
      }
      let paginationHtmlElementStructure: SemHtmlElementStructure;
      paginationHtmlElementStructure =
        await this.semHtmlElementStructureService.findOneBy(
          // completions.id,
          htmlElement.website,
          // htmlElement.group_id,
          htmlElement.selector,
        );

      const paginationHtmlElementData = await this.parseHtmlElement(
        htmlElement,
        completions,
      );

      if (!paginationHtmlElementStructure) {
        paginationHtmlElementStructure =
          await this.semHtmlElementStructureService.createHtmlElementStructure(
            htmlElement.website,
            // htmlElement.group_id,
            htmlElement.selector,
            HTML_ELEMENT_TYPE_PAGINATION,
            '', //htmlElement.content,
            completions,
          );
        console.log(
          'ServiceOpenaiService getPaginationData() paginationHtmlElementStructure: ',
          paginationHtmlElementStructure,
        );
      }

      return paginationHtmlElementData;
    } catch (error) {
      this.logger.error(
        `Failed to get pagination data for HTML element id: ${htmlElement.id}`,
        error.stack,
      );
      // throw new Error(
      //   `Failed to get pagination data for HTML element id: ${htmlElement.id}`,
      // );
    }
  }

  async parseHtmlElement(
    htmlElement: SemHtmlElement,
    completions: SemOpenaiCompletions,
    // completionsId: number,
  ): Promise<string> {
    try {
      return await this.runCompletions(completions, htmlElement.website, {
        placeholder: '<html_element>',
        content: htmlElement.content,
      });
    } catch (error) {
      this.logger.error(
        `Failed to parse HTML element: ${htmlElement}`,
        error.stack,
      );
      throw new Error(`Failed to parse HTML element: ${htmlElement}`);
    }
  }

  async runCompletions(
    // htmlElement: SemHtmlElement,
    completions: SemOpenaiCompletions,
    website: SemWebsite,
    parameters?: any,
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
      if (
        completionsMessageIndex !== -1 &&
        parameters?.placeholder &&
        parameters?.content
      ) {
        completionsJSON.messages[completionsMessageIndex].content =
          completionsJSON.messages[completionsMessageIndex].content.replace(
            parameters.placeholder,
            parameters.content,
          );
        console.log('Updated completionsJSON: ', completionsJSON);
      }

      const body = {
        messages: completionsJSON.messages,
        // messages: [
        //   { role: 'system', content: 'You are a helpful assistant.' },
        //   { role: 'user', content: 'Tell me the result of 2 x 2' },
        // ],
        model: completionsJSON.model, //"gpt-3.5-turbo",
      };
      const bodyString = JSON.stringify(body);
      const bodyHash = hashString(bodyString);
      const semOpenaiCompletionsRequest =
        await this.semOpenaiCompletionsRequestService.findOneBy(
          bodyHash,
          completions,
          website,
        );
      if (semOpenaiCompletionsRequest === null) {
        await this.semOpenaiCompletionsRequestService.findOneBy(
          bodyHash,
          completions,
        );
      }
      if (semOpenaiCompletionsRequest !== null) {
        console.log(
          `OpenaiCompletionsRequest fetched from cache with hash ${bodyHash} for website id ${website.id} and completions id ${completions.id}`,
        );
        return semOpenaiCompletionsRequest.response;
      }

      // The system message helps set the behavior of the assistant
      const completionsResponse = await openai.chat.completions.create(body);
      console.log('parseHtmlElement() completion: ', completionsResponse);
      const response: string = completionsResponse.choices[0].message.content;
      console.log('parseHtmlElement() response: ', response);
      await this.semOpenaiCompletionsRequestService.createOpenaiCompletionsRequest(
        website,
        bodyHash,
        response,
        completions,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to run completions id: ${completions.id}`,
        error.stack,
      );
      throw new Error(`Failed to run completions id: ${completions.id}`);
    }
  }
}
