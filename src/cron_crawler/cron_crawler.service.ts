import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import * as robotsParser from 'robots-txt-parser';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { SemCurrency } from '../entities/sem_currency.entity';
import { SemCurrencyService } from '../entities/sem_currency.service';
import { SemCategoryService } from '../entities/sem_category.service';
import {
  SemProcessService,
  // SemProcessStatus,
} from '../entities/sem_process.service';
import { SemWebsite } from '../entities/sem_website.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemWebsiteService } from '../entities/sem_website.service';
import {
  ServiceOpenaiService,
  ProductHtmlElementStructure,
  PaginationHtmlElementData,
} from '../service_openai/service_openai.service';
import { SemHtmlElementStructureService } from '../entities/sem_html_element_structure.service';
import {
  SemProductService,
  ProductStructure,
} from '../entities/sem_product.service';
import {
  // HTML_ELEMENT_TYPE_PAGINATION,
  // HTML_ELEMENT_TYPE_PRODUCT,
  // HTML_ELEMENT_TYPE_CATEGORY,
  // HTML_ELEMENT_TYPE_PAGINATION,
  entitiesMatch,
  removeTrailingSlash,
  delay,
  getFormattedUrl,
} from '../utils/globals';
import { Connection } from 'typeorm';
const {
  // HTML_ELEMENT_TYPE_UNKNOWN,
  HTML_ELEMENT_TYPE_PRODUCT,
  // HTML_ELEMENT_TYPE_CATEGORY,
  HTML_ELEMENT_TYPE_PAGINATION,
  PROCESS_STATUS_RUNNING,
  PROCESS_STATUS_PAUSED,
  PROCESS_STATUS_STOPPED,
  // PROCESS_STATUS_ERROR,
  WEBSITE_STATUS_RUNNING,
  WEBSITE_STATUS_PAUSED,
  WEBSITE_STATUS_STOPPED,
  // WEBSITE_STATUS_ERROR,
} = require('../../client/src/utils/globals');

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
    private readonly semProductService: SemProductService,
    private readonly semCurrencyService: SemCurrencyService,
    private readonly semCategoryService: SemCategoryService,
    @Inject('MEMORY_DATABASE_CONNECTION')
    private readonly memoryDbConnection: Connection,
  ) {}

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour
  async handleCron() {
    // const isDebug = process.env.NODE_DEBUG === 'true';
    let timestampMs;
    let intervalMs;
    let processId;

    // Setup memory db connection table , for blocking requests from the frontend while crawling is running

    await this.memoryDbConnection.query(
      'CREATE TABLE IF NOT EXISTS crawler_lock(is_locked INT NOT NULL PRIMARY KEY)',
    );

    this.logger.debug('Starting crawler job');

    try {
      await this.memoryDbConnection.query(
        'INSERT OR IGNORE INTO crawler_lock (is_locked) VALUES (1)',
      );

      const processArray = await this.semProcessService.findAll();

      for (const processLazy of processArray) {
        processId = processLazy.id;

        // Reload process if it has changed from first findAll
        let process = await this.semProcessService.findOne(processId);
        if (
          process.status & PROCESS_STATUS_STOPPED ||
          process.status & PROCESS_STATUS_RUNNING
        ) {
          // Skip if it has been stopped or is already running
          continue;
        }

        intervalMs = process.interval * 60 * 60 * 1000;

        timestampMs = Date.now();
        if (process.last_start > 0) {
          // Not first run
          if (timestampMs - process.last_start < intervalMs) {
            // Interval between processes has not yet passed
            continue;
          }
          /*
          if (process.last_start > process.last_end) {
            // Previous process still running
            continue;
          }
          */
        }

        process = await this.semProcessService.updateProcessField(
          process.id,
          'status',
          PROCESS_STATUS_RUNNING, // Setting RUNNING bit only
          //process.status | PROCESS_STATUS_RUNNING, // Setting RUNNING bit
        );

        process = await this.semProcessService.updateProcessField(
          process.id,
          'last_start',
          timestampMs,
        );

        this.logger.debug('process id:', process.id);

        for (const websiteLazy of process.websites) {
          // Reload website if it has changed from first findAll
          let website = await this.semWebsiteService.findOne(websiteLazy.id);

          this.logger.debug('crawling website url:', website.url);

          if (
            website.status & WEBSITE_STATUS_STOPPED ||
            website.status & WEBSITE_STATUS_RUNNING
          ) {
            // Skip if it has been stopped or is already running
            continue;
          }

          website = await this.semWebsiteService.updateWebsiteField(
            website.id,
            'status',
            WEBSITE_STATUS_RUNNING, // Setting RUNNING bit only
            //website.status | WEBSITE_STATUS_RUNNING, // Setting RUNNING bit
          );

          timestampMs = Date.now();
          website = await this.semWebsiteService.updateWebsiteField(
            website.id,
            'last_start',
            timestampMs,
          );

          website = await this.semWebsiteService.updateWebsiteField(
            website.id,
            'message',
            '',
          );

          await this.crawl(website);

          // const websiteUpdated = await this.semWebsiteService.findOne(
          //   website.id,
          // );
          website = await this.semWebsiteService.updateWebsiteField(
            website.id,
            'status',
            WEBSITE_STATUS_PAUSED, // Setting PAUSED bit only
            //website.status | WEBSITE_STATUS_PAUSED, // Setting PAUSED bit
          );

          // if (isDebug) {
          // Delete products that no longer exist
          await this.semProductService.deleteOlderThan(timestampMs, website);
          // }
        }

        timestampMs = Date.now();
        process = await this.semProcessService.updateProcessField(
          process.id,
          'last_end',
          timestampMs,
        );

        process = await this.semProcessService.updateProcessField(
          process.id,
          'status',
          PROCESS_STATUS_PAUSED, // Setting PAUSED bit only
          //process.status & ~PROCESS_STATUS_RUNNING, // Clearing RUNNING bit
        );
      }

      this.logger.debug('Crawler job completed successfully');
    } catch (error) {
      this.logger.error('Error running crawler job', error.stack);

      const process = await this.semProcessService.findOne(processId);
      await this.semProcessService.updateProcessField(
        process.id,
        'message',
        error.stack,
      );
    } finally {
      await this.memoryDbConnection.query('DELETE FROM crawler_lock');
    }
  }

  async shouldCrawl(url: string): Promise<boolean> {
    const robotsUrl = new URL('/robots.txt', url).href;
    try {
      await this.robotsAgent.useRobotsFor(robotsUrl);
      return this.robotsAgent.canCrawl(url);
    } catch (e) {
      console.error('Ignoring robots.txt. Not found? Exception: ', e);
    }
    return true;
  }

  async getCrawlDelay(url: string): Promise<number> {
    // if (process.env.NODE_ENV === 'test') {
    //   return 5;
    // }

    // TODO check if crawDelay already extracted and don't fetch again
    const robotsUrl = new URL('/robots.txt', url).href;
    try {
      await this.robotsAgent.useRobotsFor(robotsUrl);
      return this.robotsAgent.getCrawlDelay();
    } catch (e) {
      console.error('Ignoring robots.txt. Not found? Exception: ', e);
    }
    return 0;
  }

  async scrollToBottom(page: puppeteer.Page) {
    try {
      let lastHeight = await page.evaluate('document.body.scrollHeight');
      let scrollCounter = 0;
      while (scrollCounter++ <= 100) {
        for (let i = 1; i <= 20; i++) {
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await page.waitForTimeout(2000); // sleep a bit
          await page.evaluate(
            'window.scrollTo(0, document.body.scrollHeight-200)',
          );
          await page.waitForTimeout(100); // sleep a bit
        }
        let newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
          return;
        }
        lastHeight = newHeight;
        console.log('in scrollToBottom newHeight = ' + newHeight);
      }
    } catch (error) {
      console.error(`Failed scrollToBottom: `, error);
    }
  }

  async crawl(websiteLazy: SemWebsite) {
    // const isDebug = process.env.NODE_DEBUG === 'true';
    // const isDebug = process.execArgv.some(
    //   (arg) => arg.includes('--inspect') || arg.includes('--debug'),
    // );
    // console.log('isDebug: ', isDebug);
    // if (!isDebug) {
    //   return;
    // }

    const url = removeTrailingSlash(websiteLazy.url);

    const canCrawl = await this.shouldCrawl(url);
    if (!canCrawl) {
      console.warn(`Crawling is disallowed by robots.txt: ${url}`);
      return;
    }
    const crawlDelay = await this.getCrawlDelay(url);

    let pageUrl = url;
    let currentPage = 1;
    // let pages = [];
    let total_pages = 0;
    let websiteId;

    const browser = await puppeteer.launch();
    try {
      while (pageUrl) {
        websiteId = websiteLazy.id;

        const website = await this.semWebsiteService.findOne(websiteId);
        if (
          website.status & WEBSITE_STATUS_STOPPED ||
          website.status & WEBSITE_STATUS_PAUSED
        ) {
          // Stop crawling if website processing has been stopped or paused
          break;
        }

        // Deal with pagination
        const page = await browser.newPage();
        await page.goto(pageUrl, { waitUntil: 'networkidle0' });
        // await page.goto(url, { waitUntil: 'domcontentloaded' });
        // await page.waitForSelector('your-dynamic-content-selector');
        await page.waitForTimeout(1000); // Additional time buffer, if necessary

        let html = await page.content();
        let $ = cheerio.load(html);

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
          let currentSelector = `${
            parentSelector ? parentSelector + ' > ' : ''
          }${tag}${classSelector}`;
          currentSelector = currentSelector.replace('. ', '');

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
        const removeDuplicates = (
          structures: TagStructure[],
        ): TagStructure[] => {
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
              uniqueChildren.map((child) =>
                deduplicateStructure(child, website),
              ),
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

        if (process.env.NODE_ENV === 'test' && pageUrl === url) {
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
        const updatedWebsite = await this.semWebsiteService.findOne(
          website.id,
          ['process', 'htmlElements'],
        );
        const updatedHtmlElements = updatedWebsite.htmlElements.sort(
          (a, b) => b.group_id - a.group_id,
        );

        let productHtmlElementStructure = null;
        let paginationHtmlElementStructure = null;
        let paginationHtmlElementData: string = '';

        productHtmlElementStructure =
          await this.semHtmlElementStructureService.findOneByWebsiteAndType(
            website,
            HTML_ELEMENT_TYPE_PRODUCT,
          );

        paginationHtmlElementStructure =
          await this.semHtmlElementStructureService.findOneByWebsiteAndType(
            website,
            HTML_ELEMENT_TYPE_PAGINATION,
          );

        // if (productHtmlElementStructure === null) {
        for (const updatedHtmlElement of updatedHtmlElements) {
          if (updatedHtmlElement.selector === 'body') {
            continue; // No need to parse whole body, only subsections
          }

          if (
            productHtmlElementStructure !== null &&
            paginationHtmlElementStructure !== null
          ) {
            // Product and pagination structures have already been identified, no need to call serviceOpenaiService.getHtmlElementType
            if (paginationHtmlElementStructure) {
              if (
                updatedHtmlElement.selector ===
                paginationHtmlElementStructure.selector
              ) {
                paginationHtmlElementData =
                  await this.serviceOpenaiService.getPaginationData(
                    updatedHtmlElement.id,
                    updatedHtmlElement,
                  );
                break;
              } else if (paginationHtmlElementStructure.json) {
                // infinite scrolling?
                const json = JSON.parse(paginationHtmlElementStructure.json);
                if (json.is_infinite_scrolling) {
                  break;
                }
              }
            }

            continue;
          }

          // if (
          //   isDebug &&
          //   updatedHtmlElement.selector ===
          //     'body > div > div.grid-container > main > div > div > div.row.center.cards-container > div.card.card--tile'
          // ) {
          //   debugger;
          // }

          // console.log('htmlElement.group_id: ', updatedHtmlElement.group_id);

          const htmlElementType =
            await this.serviceOpenaiService.getHtmlElementType(
              updatedHtmlElement.id,
              updatedHtmlElement,
            );
          if (
            htmlElementType === HTML_ELEMENT_TYPE_PRODUCT &&
            productHtmlElementStructure === null
          ) {
            console.log(
              'Product htmlElement.group_id: ',
              updatedHtmlElement.group_id,
            );

            productHtmlElementStructure =
              await this.serviceOpenaiService.getProductStructure(
                updatedHtmlElement.id,
                updatedHtmlElement,
              );
          } else if (htmlElementType === HTML_ELEMENT_TYPE_PAGINATION) {
            console.log(
              'Pagination htmlElement.group_id: ',
              updatedHtmlElement.group_id,
            );

            // if (paginationHtmlElementStructure === null) {
            paginationHtmlElementData =
              await this.serviceOpenaiService.getPaginationData(
                updatedHtmlElement.id,
                updatedHtmlElement,
              );
            // }
          }

          if (
            productHtmlElementStructure !== null &&
            productHtmlElementStructure !== undefined &&
            // paginationHtmlElementStructure !== null &&
            // paginationHtmlElementStructure !== undefined &&
            paginationHtmlElementData !== '' &&
            paginationHtmlElementData !== null
          ) {
            break;
          }
        }
        // }

        const productHtmlElementStructureJSON: ProductHtmlElementStructure =
          JSON.parse(productHtmlElementStructure.json);
        let productStructure: ProductStructure;

        const extractFromElement = (
          $,
          element,
          selector: string,
          attr?: string,
        ): string => {
          try {
            if (selector) {
              const selectedElement = $(element).find(selector);
              return attr ? selectedElement.attr(attr) : selectedElement.text();
            }
          } catch (error) {
            console.error(`Failed extractFromElement: ${selector}`, error);
          }
        };

        const extractNumbers = (str) => {
          if (!str) {
            return 0;
          }
          const sanitizedStr = str.replace(/null/g, '0');
          const matches = sanitizedStr.match(/\d+/g) || [];
          return matches.map(Number);
        };

        const isValidSelector = ($, selector) => {
          try {
            $(selector);
            return true;
          } catch (e) {
            return false;
          }
        };

        const getCurrency = async (
          $,
          productElement,
          currencyString: string,
        ): Promise<SemCurrency> => {
          let currencyStringTemp: string;

          if (!currencyString) {
            return null;
          }

          if (isValidSelector($, currencyString)) {
            currencyStringTemp = extractFromElement(
              $,
              productElement,
              currencyString,
            );
          }
          if (!currencyStringTemp) {
            currencyStringTemp = currencyString;
          }
          // This will remove trailing spaces and colons
          currencyStringTemp = currencyStringTemp.replace(/[:\s]+$/, '');
          if (!currencyStringTemp) {
            return null;
          }

          const currency: SemCurrency =
            await this.semCurrencyService.getCurrencyFromString(
              currencyStringTemp,
            );

          return currency;
        };

        // if infinite scroll , scroll down as many times as possible.
        // in the meantime , allow the frontend to query the products , so unlock the db
        await this.memoryDbConnection.query('DELETE FROM crawler_lock');
        console.log(
          'before scrollToBottom. once finished , you should see another log here...',
        );
        await this.scrollToBottom(page);
        console.log(
          'scrollToBottom finished. Re-downloading the whole HTML from the page.',
        );
        // infinite scrolling finished , continue the crawling.
        // Lock the db to prevent the frontend to use it during crawling
        await this.memoryDbConnection.query(
          'INSERT OR IGNORE INTO crawler_lock (is_locked) VALUES (1)',
        );
        // now reload the whole html to get all products at once, if the site had infinite scroll
        html = await page.content();
        $ = cheerio.load(html);

        const productElements = $(productHtmlElementStructure.selector).get();
        let numbers = [];

        // Loop through product elements to insert/update them
        // $(productHtmlElementStructure.selector).each((index, element) => {
        for (const productElement of productElements) {
          // 'element' refers to the current item in the loop
          // You can use $(element) to wrap it with Cheerio and use jQuery-like methods

          productStructure = {
            url: null,
            thumbnailUrl: null,
            title: null,
            description: null,
            description_long: null,
            price_01: null,
            currency_01_id: null,
            price_02: null,
            currency_02_id: null,
            category_id: null,
            timestamp: null,
          };

          productStructure.url =
            // removeTrailingSlash(website.url) +
            extractFromElement(
              $,
              productElement,
              productHtmlElementStructureJSON.url,
              'href',
            );
          productStructure.url = getFormattedUrl(
            website.url,
            productStructure.url,
          );

          // TODO Check if url or data
          productStructure.thumbnailUrl = extractFromElement(
            $,
            productElement,
            productHtmlElementStructureJSON.thumbnail,
            'src',
          );
          productStructure.thumbnailUrl = getFormattedUrl(
            website.url,
            productStructure.thumbnailUrl,
          );

          console.log(
            'productStructure.thumbnailUrl =  ' + productStructure.thumbnailUrl,
          );

          productStructure.title = extractFromElement(
            $,
            productElement,
            productHtmlElementStructureJSON.title,
          );

          productStructure.description = extractFromElement(
            $,
            productElement,
            productHtmlElementStructureJSON.description,
          );

          console.log('productStructure.title =  ' + productStructure.title);

          // if (
          //   productStructure.thumbnailUrl &&
          //   productStructure.thumbnailUrl.startsWith('/') &&
          //   !productStructure.thumbnailUrl.startsWith(
          //     removeTrailingSlash(website.url),
          //   )
          // ) {
          //   // If it's an url and it's relative, not absolute
          //   productStructure.thumbnailUrl =
          //     removeTrailingSlash(website.url) + productStructure.thumbnailUrl;
          // }

          numbers = [];
          numbers = extractNumbers(
            extractFromElement(
              $,
              productElement,
              productHtmlElementStructureJSON.price_01,
            ),
          );
          productStructure.price_01 =
            numbers && numbers.length > 0 ? numbers[0] : 0;
          if (!productStructure.price_01) {
            continue;
          }

          console.log(
            'productStructure.price_01 =  ' + productStructure.price_01,
          );

          const currency_01 = await getCurrency(
            $,
            productElement,
            productHtmlElementStructureJSON.currency_01,
          );
          productStructure.currency_01_id = currency_01.id;

          numbers = [];
          numbers = extractNumbers(
            extractFromElement(
              $,
              productElement,
              productHtmlElementStructureJSON.price_02,
            ),
          );
          productStructure.price_02 =
            numbers.length > 1
              ? numbers[1]
              : productStructure.price_01 === 0
                ? numbers[0]
                : 0;

          const currency_02 = await getCurrency(
            $,
            productElement,
            productHtmlElementStructureJSON.currency_02,
          );
          productStructure.currency_02_id = currency_02 ? currency_02.id : null;

          if (
            !productStructure.currency_01_id &&
            !productStructure.currency_02_id
          ) {
            continue;
          }

          const categoryName =
            await this.serviceOpenaiService.getProductCategory(
              productStructure.title,
              website,
            );
          console.log('categoryName = ' + categoryName);
          const category =
            await this.semCategoryService.findOneByName(categoryName);
          productStructure.category_id = category ? category.id : null;

          productStructure.timestamp = Date.now();

          let productAlreadyExist: boolean = false;

          console.log('findOneByUrl  ' + productStructure.url);

          // Url must be unique
          let product = await this.semProductService.findOneByUrl(
            productStructure.url,
          );
          if (product) {
            if (
              entitiesMatch(product, productStructure, {
                exclude: ['id', 'timestamp'],
              })
            ) {
              // Product already existing in database
              productAlreadyExist = true;
              product = await this.semProductService.updateProductTimestamp(
                product,
                productStructure.timestamp,
              );
            } else {
              // Delete previous product with same url
              await this.semProductService.delete(product.id);
            }
          }
          if (
            !productAlreadyExist &&
            (productStructure.currency_01_id || productStructure.currency_02_id)
          ) {
            console.log('createProduct');
            await this.semProductService.createProduct(
              productStructure,
              website,
            );
          }
        }

        if (!paginationHtmlElementData) {
          // if no pagination , infinite scroll. we will scrape from the same page next time.
          break;
        }

        console.log('Trying to navigate to next page...');

        pageUrl = null;
        const paginationJSON: PaginationHtmlElementData = JSON.parse(
          paginationHtmlElementData,
        );
        if (paginationJSON.current_page < paginationJSON.total_pages) {
          // if (paginationHtmlElementData || pages.length > 0) {
          //   if (pages.length === 0) {
          //     pages = JSON.parse(paginationHtmlElementData);
          //   }

          // if (pages.length > 1) {
          //   if (currentPage < pages.length) {
          pageUrl = getFormattedUrl(website.url, paginationJSON.next_page_url); //pages[currentPage];
          // if (!pageUrl.startsWith(removeTrailingSlash(website.url))) {
          //   // If it's a relative url, not absolute
          //   if (!pageUrl.startsWith('/')) {
          //     pageUrl = '/' + pageUrl;
          //   }

          //   pageUrl = removeTrailingSlash(website.url) + pageUrl;
          // }
          // }
          currentPage++; // Failsafe in case of infinite loops
          // }
        }

        console.log('currentPage = ' + currentPage);

        if (total_pages === 0) {
          websiteLazy = await this.semWebsiteService.updateWebsiteField(
            websiteLazy.id,
            'num_pages',
            paginationJSON.total_pages,
          );
          total_pages = paginationJSON.total_pages;
        }
        websiteLazy = await this.semWebsiteService.updateWebsiteField(
          websiteLazy.id,
          'last_page',
          paginationJSON.current_page,
        );
        if (currentPage > total_pages) {
          console.log('currentPage > total_pages');
          break;
        }
        if (pageUrl) {
          delay(crawlDelay);
        }
        console.log('pageUrl = ' + pageUrl);
      }
      // });
    } catch (error) {
      console.error(`Failed to crawl: ${url}`, error);

      // Update the existing websiteLazy object instead of reassigning it
      const website = await this.semWebsiteService.findOne(websiteId);
      if (website) {
        Object.assign(websiteLazy, website);
      }

      const message: string = error.message;
      websiteLazy = await this.semWebsiteService.updateWebsiteField(
        websiteLazy.id,
        'message',
        message,
      );
    } finally {
      await browser.close();
    }
  }
}
