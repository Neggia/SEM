import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import * as robotsParser from 'robots-txt-parser';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { SemProcessService } from '../entities/sem_process.service';

interface TagStructure {
  tag: string;
  classes?: string[];
  children?: TagStructure[];
  html: string;
}

@Injectable()
export class CronCrawlerService {
  private readonly logger = new Logger(CronCrawlerService.name);
  private robotsAgent = robotsParser({
    userAgent: 'SEMCrawler', // The name of your crawler
    allowOnNeutral: false, // If true, will allow access to undefined paths
  });

  constructor(private readonly semProcessService: SemProcessService) {}

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
            await this.crawl(website.url);
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

  async crawl(url: string) {
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

      // Function to recursively traverse the DOM and record the tag structure with classes and HTML
      const getTagStructure = (element: cheerio.Element): TagStructure => {
        const structure: TagStructure = {
          tag: element.tagName,
          html: $(element).html() || '', // Get the HTML content or an empty string if none
        };

        // Get the element's classes
        const classList = $(element).attr('class');
        if (classList) {
          structure.classes = classList.split(/\s+/);
        }

        // If the element has children, recurse
        const children = $(element).children().toArray();
        if (children.length > 0) {
          structure.children = children.map((child) => getTagStructure(child));
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

      // Function to recursively deduplicate all structures
      const deduplicateStructure = (structure: TagStructure): TagStructure => {
        if (structure.children) {
          // Deduplicate children
          const deduplicatedChildren = removeDuplicates(
            structure.children.map(deduplicateStructure),
          );
          return { ...structure, children: deduplicatedChildren };
        }
        return structure;
      };

      // Start from the body element
      const bodyStructure = getTagStructure($('body')[0]);

      // Deduplicate the body structure
      const deduplicatedBodyStructure = deduplicateStructure(bodyStructure);

      /*       // This is a placeholder for an array of all elements
      const elements = $('body').find('*').toArray();

      // This is a simplified example of a comparison function
      const areElementsSimilar = (elementA, elementB) => {
        // Compare tagName, class, and structure
        // This is a naive implementation; you might need something more robust
        return (
          elementA.tagName === elementB.tagName &&
          $(elementA).attr('class') === $(elementB).attr('class') &&
          $(elementA).children().length === $(elementB).children().length
        );
      };

      // Group similar elements
      const groups = elements.reduce((acc, element, index, array) => {
        // Check if the element is already part of a group
        const existingGroup = acc.find((group) =>
          group.some((member) => areElementsSimilar(member, element)),
        );

        if (existingGroup) {
          // If it is similar to a group, add to that group
          existingGroup.push(element);
        } else {
          // If not, create a new group
          acc.push([element]);
        }

        return acc;
      }, []);

      // Log group info
      // console.log(
      //   groups.map((group) => ({
      //     count: group.length,
      //     tagName: group[0].tagName,
      //     class: $(group[0]).attr('class'),
      //   })),
      // );
      const groupsData = groups.map((group) => {
        const element = group[0]; // Assuming the 'top' element is the first in the group
        return {
          count: group.length,
          tagName: element.tagName,
          class: $(element).attr('class'),
          html: $(element).html(), // Get the HTML of the top element
        };
      }); */

      // Convert your data to a string format, typically JSON for complex data
      const groupsDataString = JSON.stringify(
        deduplicatedBodyStructure, //bodyStructure, //groupsData,
        null,
        2,
      );

      const urlObj = new URL(url);
      const baseUrl = `${urlObj.hostname}`;
      // Define your subfolder path and file name
      const logsSubfolder = 'logs'; // Replace with your subfolder name
      const logFilename = baseUrl + '.output.json'; // Replace with your file name

      // Check if the subfolder exists; if not, create it
      const subfolderPath = path.join(appRoot.path, logsSubfolder);
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath, { recursive: true });
      }

      // Define the full path for the file
      const filePath = path.join(subfolderPath, logFilename);

      // Write the string to a file
      fs.writeFileSync(filePath, groupsDataString);
    } catch (error) {
      console.error(`Failed to crawl: ${url}`, error);
    } finally {
      await browser.close();
    }
  }
}
