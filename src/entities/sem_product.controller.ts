import { Controller, Get, Param } from '@nestjs/common';
import { SemProductService } from './sem_product.service';

const { CONTROLLER_PRODUCT_ID } = require('../../client/src/utils/globals');

@Controller(CONTROLLER_PRODUCT_ID)
export class SemProductController {
  constructor(private readonly semProductService: SemProductService) {}

  @Get()
  findAll() {
    return this.semProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semProductService.findOne(+id);
  }
}
