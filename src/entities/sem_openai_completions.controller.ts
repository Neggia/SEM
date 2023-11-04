import { Controller, Get, Param } from '@nestjs/common';
import { SemOpenaiCompletionsService } from './sem_openai_completions.service';

@Controller('openai-completions')
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
