import { Controller, Get, Query } from '@nestjs/common';
import { ServiceOpenaiService } from './service_openai.service';

@Controller('service-openai')
export class ServiceOpenaiController {
  constructor(private readonly serviceOpenaiService: ServiceOpenaiService) {}

  @Get('get-product')
  getProduct(@Query('html_element_id') htmlElementId: number): Promise<any> {
    return this.serviceOpenaiService.getProduct(htmlElementId);
  }
}
