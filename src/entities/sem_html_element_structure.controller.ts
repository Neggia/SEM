import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import {
  SemHtmlElementStructureService,
  SemHtmlElementStructureDto,
} from './sem_html_element_structure.service';

const {
  CONTROLLER_HTML_ELEMENT_STRUCTURE_ID,
  CONTROLLER_HTML_ELEMENT_STRUCTURE_SYNC,
} = require('../../client/src/utils/globals');

@Controller(CONTROLLER_HTML_ELEMENT_STRUCTURE_ID)
export class SemHtmlElementStructureController {
  constructor(
    private readonly semHtmlElementStructureService: SemHtmlElementStructureService,
  ) {}

  @Get()
  findAll(@Query('type') type: number) {
    return this.semHtmlElementStructureService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semHtmlElementStructureService.findOne(+id);
  }

  @Post(CONTROLLER_HTML_ELEMENT_STRUCTURE_SYNC)
  async sync(@Body() htmlElementStructureDto: SemHtmlElementStructureDto) {
    return this.semHtmlElementStructureService.sync(htmlElementStructureDto);
  }

  // Add other endpoints as needed
}
