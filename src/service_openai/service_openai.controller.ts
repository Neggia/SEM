import { Controller, Get, Query } from '@nestjs/common';
import { ServiceOpenaiService } from './service_openai.service';

@Controller('service-openai')
export class ServiceOpenaiController {
  constructor(private readonly serviceOpenaiService: ServiceOpenaiService) {}

  @Get('get-product-json')
  getProductJSON(
    @Query('html_element_id') htmlElementId: number,
  ): Promise<any> {
    return this.serviceOpenaiService.getProductJSON(htmlElementId);
  }
}
