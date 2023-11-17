import { Fixture } from './fixtures.service';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import {
  HTML_ELEMENT_TYPE_UNKNOWN,
  HTML_ELEMENT_TYPE_PRODUCT,
  HTML_ELEMENT_TYPE_CATEGORY,
  HTML_ELEMENT_TYPE_PAGINATION,
} from '../utils/globals';

export const SemOpenaiCompletionsFixtures: Fixture = {
  entityType: SemOpenaiCompletions,
  data: [
    {
      id: 1,
      function_name: 'getProductStructure',
      website_id: null,
      group_id: null,
      body: '{"model": "gpt-4","messages": [{"role": "system", "content": "You are an HTML parser."}, {"role": "user", "content": "Parse a product/service item of an ecommerce page and identify the elements for item details url, thumbnail, title, description, and price (it could have two prices because of complementary coins, report both in that case). Return a JSON object, without any other text, with the following structure: { url: string; thumbnail: string; title: string; description: string; price_01: string; price_02: string; }. Set each field with the html selector to extract the identified element or null if not available. The HTML code is the following: <html_element>"}]}',
      htmlElementStructures: null, //[0, 2],
      // parameters:
      //   '{"<html_element>": "<div class="card card--tile"><a class="cardimg-container" href="/product/6526c501614fae0002a33100"><img class="medium" width="280" height="280" src="https://pagineazzurre2.s3.eu-west-3.amazonaws.com/i286260064340696833._szw1280h1280_.jpg" alt="VAL Memoryonline Ricorda i tuoi Cari Torino  " loading="lazy"></a><div class="cardtext"><div class="row center">Servizio</div><div class="card-body"><a href="/product/6526c501614fae0002a33100"><h2 class="cardproduct-name">VAL Memoryonline Ricorda i tuoi Cari Torino  </h2></a><div class="carddetails"><div class="cardproduct-seller"><a href="/product/6526c501614fae0002a33100">GIANNI</a></div><div class="rating"><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span class="ratingcount">0 reviews</span></div><div class="card__price-container"><div class="price euro">€ 8&nbsp; e</div><div class="price">&nbsp;&nbsp;☯ 2</div></div></div></div></div></div>"}',
    },
    {
      id: 2,
      function_name: 'getHtmlElementType',
      website_id: null,
      group_id: null,
      body: `{"model": "gpt-3.5-turbo","messages": [{"role": "system", "content": "You are an HTML parser."}, {"role": "user", "content": "Parse the following HTML code of an ecommerce page and identify if the element is a product (${HTML_ELEMENT_TYPE_PRODUCT}), a category (${HTML_ELEMENT_TYPE_CATEGORY}), a pagination (${HTML_ELEMENT_TYPE_PAGINATION}) or you can't identify it (${HTML_ELEMENT_TYPE_UNKNOWN}) and return the corresponding number: <html_element>"}]}`,
      htmlElementStructures: null, //[1],
      // parameters:
      //   '{"<html_element>": "<div class="card card--tile"><a class="cardimg-container" href="/product/6526c501614fae0002a33100"><img class="medium" width="280" height="280" src="https://pagineazzurre2.s3.eu-west-3.amazonaws.com/i286260064340696833._szw1280h1280_.jpg" alt="VAL Memoryonline Ricorda i tuoi Cari Torino  " loading="lazy"></a><div class="cardtext"><div class="row center">Servizio</div><div class="card-body"><a href="/product/6526c501614fae0002a33100"><h2 class="cardproduct-name">VAL Memoryonline Ricorda i tuoi Cari Torino  </h2></a><div class="carddetails"><div class="cardproduct-seller"><a href="/product/6526c501614fae0002a33100">GIANNI</a></div><div class="rating"><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span><i class="fa fa-star-o"></i></span><span class="ratingcount">0 reviews</span></div><div class="card__price-container"><div class="price euro">€ 8&nbsp; e</div><div class="price">&nbsp;&nbsp;☯ 2</div></div></div></div></div></div>"}',
    },
  ],
  relations: ['htmlElementStructures'],
};
