import { Controller, Get, Param } from '@nestjs/common';
import { SemOpenaiCompletionsService } from './sem_openai_completions.service';
import { CONTROLLER_OPENAI_COMPLETIONS_ID } from '../../client/src/utils/globals';

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
}
