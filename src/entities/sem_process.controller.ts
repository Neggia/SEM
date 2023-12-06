import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SemProcessService, SemProcessDto } from './sem_process.service';

const {
  CONTROLLER_PROCESS_ID,
  CONTROLLER_PROCESS_SYNC,
} = require('../../client/src/utils/globals');

@Controller(CONTROLLER_PROCESS_ID)
export class SemProcessController {
  constructor(private readonly semProcessService: SemProcessService) {}

  @Get()
  findAll() {
    return this.semProcessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semProcessService.findOne(+id);
  }

  @Post(CONTROLLER_PROCESS_SYNC)
  async sync(@Body() processDto: SemProcessDto) {
    return this.semProcessService.sync(processDto);
  }

  // Add other endpoints as needed
}
