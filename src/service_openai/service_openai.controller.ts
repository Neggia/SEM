import { Controller, Get, Query } from '@nestjs/common';
import { ServiceOpenaiService } from './service_openai.service';
import {
  CONTROLLER_SERVICE_OPENAI_ID,
  CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE,
  CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS,
} from '../../client/src/utils/globals';

@Controller(CONTROLLER_SERVICE_OPENAI_ID)
export class ServiceOpenaiController {
  constructor(private readonly serviceOpenaiService: ServiceOpenaiService) {}

  @Get(CONTROLLER_SERVICE_OPENAI_GET_PRODUCT_STRUCTURE)
  getProduct(@Query('html_element_id') htmlElementId: number): Promise<any> {
    return this.serviceOpenaiService.getProductStructure(htmlElementId);
  }

  @Get(CONTROLLER_SERVICE_OPENAI_GET_FUNCTIONS)
  getFunctions() {
    return this.serviceOpenaiService.getFunctions();
  }
}
