import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import * as robotsParser from 'robots-txt-parser';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { SemProcessService } from '../entities/sem_process.service';
import { SemWebsite } from '../entities/sem_website.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemWebsiteService } from '../entities/sem_website.service';
import { ServiceOpenaiService } from '../service_openai/service_openai.service';
import { SemHtmlElementStructureService } from '../entities/sem_html_element_structure.service';
import {
  HTML_ELEMENT_TYPE_PRODUCT,
  // HTML_ELEMENT_TYPE_CATEGORY,
  // HTML_ELEMENT_TYPE_PAGINATION,
} from '../utils/globals';

interface TagStructure {
  tag: string;
  classes?: string[];
  children?: TagStructure[];
  html: string;
  groupId?: number;
  selector: string;
}

@Injectable()
export class CronCrawlerService {
  private readonly logger = new Logger(CronCrawlerService.name);
  private robotsAgent = robotsParser({
    userAgent: 'SEMCrawler', // The name of your crawler
    allowOnNeutral: false, // If true, will allow access to undefined paths
  });

  constructor(
    private readonly semProcessService: SemProcessService,
    private readonly semHtmlElementService: SemHtmlElementService,
    private readonly semWebsiteService: SemWebsiteService,
    private readonly semHtmlElementStructureService: SemHtmlElementStructureService,
    private readonly serviceOpenaiService: ServiceOpenaiService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour, adjust as needed
  async handleCron() {
    this.logger.debug('Starting crawler job');
    try {
      // Your crawler logic here
      const processArray = await this.semProcessService.findAll();
      for (const process of processArray) {
        console.log('process:', process);
        for (const website of process.websites) {
          console.log('website.url:', website.url);
          // Test
          if (website.url === 'https://www.pagineazzurre.net/') {
            await this.crawl(website);
          }
        }
      }

      this.logger.debug('Crawler job completed successfully');
    } catch (error) {
      this.logger.error('Error running crawler job', error.stack);
    }
  }

  async shouldCrawl(url: string): Promise<boolean> {
    const robotsUrl = new URL('/robots.txt', url).href;
    await this.robotsAgent.useRobotsFor(robotsUrl);
    return this.robotsAgent.canCrawl(url);
  }

  async crawl(website: SemWebsite) {
    const isDebug = process.env.NODE_DEBUG === 'true';
    // const isDebug = process.execArgv.some(
    //   (arg) => arg.includes('--inspect') || arg.includes('--debug'),
    // );
    console.log('isDebug: ', isDebug);
    if (!isDebug) {
      return;
    }

    const url = website.url;

    const canCrawl = await this.shouldCrawl(url);
    if (!canCrawl) {
      console.warn(`Crawling is disallowed by robots.txt: ${url}`);
      return;
    }

    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      // await page.goto(url, { waitUntil: 'domcontentloaded' });
      // await page.waitForSelector('your-dynamic-content-selector');
      await page.waitForTimeout(1000); // Additional time buffer, if necessary

      const html = await page.content();
      const $ = cheerio.load(html);

      // Function to recursively traverse the DOM and record the tag structure with classes, HTML, and selector
      const getTagStructure = (
        element: cheerio.Element,
        parentSelector?: string,
      ): TagStructure => {
        const tag = element.tagName;
        const classes = $(element).attr('class')
          ? $(element).attr('class').split(/\s+/)
          : [];
        const classSelector = classes.length ? '.' + classes.join('.') : '';
        const currentSelector = `${
          parentSelector ? parentSelector + ' > ' : ''
        }${tag}${classSelector}`;

        const structure: TagStructure = {
          tag,
          html: $(element).html() || '',
          selector: currentSelector,
        };

        if (classes.length) {
          structure.classes = classes;
        }

        // If the element has children, recurse
        const children = $(element).children().toArray();
        if (children.length > 0) {
          structure.children = children.map((child) =>
            getTagStructure(child, currentSelector),
          );
        }

        return structure;
      };

      // Function to check if two TagStructure objects are equal
      const areStructuresEqual = (
        a: TagStructure,
        b: TagStructure,
      ): boolean => {
        // Check if tags and classes are the same
        if (
          a.tag !== b.tag ||
          (a.classes || []).join(' ') !== (b.classes || []).join(' ')
        ) {
          return false;
        }

        // Check if children arrays are the same length
        if ((a.children || []).length !== (b.children || []).length) {
          return false;
        }

        // Recursively check all children
        for (let i = 0; i < (a.children || []).length; i++) {
          if (!areStructuresEqual(a.children![i], b.children![i])) {
            return false;
          }
        }

        return true;
      };

      // Function to remove duplicate structures
      const removeDuplicates = (structures: TagStructure[]): TagStructure[] => {
        return structures.reduce<TagStructure[]>((unique, current) => {
          if (!unique.some((item) => areStructuresEqual(item, current))) {
            unique.push(current);
          }
          return unique;
        }, []);
      };

      let globalGroupId = 0; // Counter for unique groupId

      await this.semHtmlElementService.deleteHtmlElementsByWebsite(website);

      // Function to recursively deduplicate all structures and assign unique groupId
      const deduplicateStructure = async (
        structure: TagStructure,
        website: SemWebsite,
      ): Promise<TagStructure> => {
        // Assign a unique groupId to the current structure if it doesn't have one
        if (structure.groupId === undefined) {
          structure.groupId = ++globalGroupId;
        }

        // Create a record for the current structure
        await this.semHtmlElementService.createHtmlElement(
          structure.groupId,
          structure.selector,
          structure.html,
          website,
        );

        // If the structure has children, process them recursively
        if (structure.children) {
          // First, remove duplicates from the children
          const uniqueChildren = removeDuplicates(structure.children);

          // Then, process each unique child asynchronously and wait for all to complete
          structure.children = await Promise.all(
            uniqueChildren.map((child) => deduplicateStructure(child, website)),
          );
        }

        return structure;
      };

      // Start from the body element
      const bodyStructure = getTagStructure($('body')[0]);

      // Deduplicate the body structure
      const deduplicatedBodyStructure = await deduplicateStructure(
        bodyStructure,
        website,
      );

      if (process.env.NODE_ENV === 'test') {
        // Convert your data to a string format, typically JSON for complex data
        const groupsDataString = JSON.stringify(
          deduplicatedBodyStructure,
          null,
          2,
        );

        const urlObj = new URL(url);
        const baseUrl = `${urlObj.hostname}`;
        const logsSubfolder = 'logs';
        const logFilename = baseUrl + '.output.json';

        // Check if the subfolder exists; if not, create it
        const subfolderPath = path.join(appRoot.path, logsSubfolder);
        if (!fs.existsSync(subfolderPath)) {
          fs.mkdirSync(subfolderPath, { recursive: true });
        }

        // Define the full path for the file
        const filePath = path.join(subfolderPath, logFilename);

        // Write the string to a file
        fs.writeFileSync(filePath, groupsDataString);
      }

      // if (!isDebug) {
      //   return;
      // }

      // htmlElements sorted by group_id in descending order, from innermost to outermost
      const updatedWebsite = await this.semWebsiteService.findOne(website.id);
      const updatedHtmlElements = updatedWebsite.htmlElements.sort(
        (a, b) => b.group_id - a.group_id,
      );

      let productStructure;

      productStructure =
        await this.semHtmlElementStructureService.findOneByWebsiteAndType(
          website,
          HTML_ELEMENT_TYPE_PRODUCT,
        );
      if (productStructure === null) {
        for (const updatedHtmlElement of updatedHtmlElements) {
          if (updatedHtmlElement.selector === 'body') {
            continue; // No need to parse whole body, only subsections
          }

          // if (
          //   isDebug &&
          //   updatedHtmlElement.selector ===
          //     'body > div > div.grid-container > main > div > div > div.row.center.cards-container > div.card.card--tile'
          // ) {
          //   debugger;
          // }

          console.log('htmlElement.group_id: ', updatedHtmlElement.group_id);

          const htmlElementType =
            await this.serviceOpenaiService.getHtmlElementType(
              updatedHtmlElement.id,
              updatedHtmlElement,
            );
          if (htmlElementType === HTML_ELEMENT_TYPE_PRODUCT) {
            console.log(
              'Product htmlElement.group_id: ',
              updatedHtmlElement.group_id,
            );

            productStructure =
              await this.serviceOpenaiService.getProductStructure(
                updatedHtmlElement.id,
                updatedHtmlElement,
              );
          }

          if (productStructure !== null && productStructure !== undefined) {
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Failed to crawl: ${url}`, error);
    } finally {
      await browser.close();
    }
  }
}
