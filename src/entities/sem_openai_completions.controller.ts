import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import {
  SemOpenaiCompletionsService,
  SemOpenaiCompletionsDto,
} from './sem_openai_completions.service';
// import { CONTROLLER_OPENAI_COMPLETIONS_ID } from '../../client/src/utils/globals';

const {
  CONTROLLER_OPENAI_COMPLETIONS_ID,
  CONTROLLER_OPENAI_COMPLETIONS_SYNC,
} = require('../../client/src/utils/globals');

@Controller(CONTROLLER_OPENAI_COMPLETIONS_ID)
export class SemOpenaiCompletionsController {
  constructor(
    private readonly semOpenaiCompletionsService: SemOpenaiCompletionsService,
  ) {}

  @Get()
  findAll() {
    return this.semOpenaiCompletionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semOpenaiCompletionsService.findOne(+id);
  }

  @Post(CONTROLLER_OPENAI_COMPLETIONS_SYNC)
  async sync(@Body() openaiCompletionsDto: SemOpenaiCompletionsDto) {
    return this.semOpenaiCompletionsService.sync(openaiCompletionsDto);
  }
}
