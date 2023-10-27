import { Controller, Get, Query } from '@nestjs/common';
import { ServiceOpenaiService } from './service_openai.service';

@Controller('service-openai')
export class ServiceOpenaiController {
  constructor(private readonly serviceOpenaiService: ServiceOpenaiService) {}

  @Get('get-product-json')
  getProductJSON(@Query('url') htmlElement: string): Promise<any> {
    return this.serviceOpenaiService.getProductJSON(htmlElement);
  }
}
