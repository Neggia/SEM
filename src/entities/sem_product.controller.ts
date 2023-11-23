import { Controller, Get, Param, Query } from '@nestjs/common';
import { SemProductService } from './sem_product.service';

const { CONTROLLER_PRODUCT_ID } = require('../../client/src/utils/globals');

@Controller(CONTROLLER_PRODUCT_ID)
export class SemProductController {
  constructor(private readonly semProductService: SemProductService) {}

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.semProductService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semProductService.findOne(+id);
  }
}
