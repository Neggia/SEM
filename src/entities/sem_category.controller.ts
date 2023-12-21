import { Controller, Get, Param } from '@nestjs/common';
import { SemCategoryService } from './sem_category.service';

const { CONTROLLER_CATEGORY_ID } = require('../../client/src/utils/globals');

@Controller(CONTROLLER_CATEGORY_ID)
export class SemCategoryController {
  constructor(private readonly semCategoryService: SemCategoryService) {}

  @Get()
  findAll() {
    return this.semCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semCategoryService.findOne(+id);
  }

  // Add other endpoints as needed
}
