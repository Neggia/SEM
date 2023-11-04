import { Fixture } from './fixtures.service';
import { SemHtmlElementStructure } from '../entities/sem_html_element_structure.entity';

export const SemHtmlElementStructureFixtures: Fixture = {
  entityType: SemHtmlElementStructure,
  data: [
    {
      id: 0,
      website_id: 0,
      group_id: 0,
      json: '{"thumbnail":{"tag":"img","class":"medium","src":"https://pagineazzurre2.s3.eu-west-3.amazonaws.com/i286260064340696833._szw1280h1280_.jpg"},"description":{"tag":"h2","class":"cardproduct-name","text":"VALMemoryonlineRicordaituoiCariTorino"},"price":{"tag":"div","class":"cardprice-container","subtags":[{"tag":"div","class":"priceeuro","text":"€8"},{"tag":"div","class":"price","text":"☯2"}]}}',
      openaiCompletions: 0,
    },
    /*     {
      id: 1,
      website_id: 0,
      group_id: 1,
      json: '{isProduct}',
      openaiCompletions: 1,
    }, */
    {
      id: 2,
      website_id: 1,
      group_id: 0,
      json: '{"thumbnail":{"tag":"img","class":"medium","src":"https://pagineazzurre2.s3.eu-west-3.amazonaws.com/i286260064340696833._szw1280h1280_.jpg"},"description":{"tag":"h2","class":"cardproduct-name","text":"VALMemoryonlineRicordaituoiCariTorino"},"price":{"tag":"div","class":"cardprice-container","subtags":[{"tag":"div","class":"priceeuro","text":"€8"},{"tag":"div","class":"price","text":"☯2"}]}}',
      openaiCompletions: 0,
    },
  ],
  relations: ['openaiCompletions'],
};
