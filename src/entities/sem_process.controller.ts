import { Controller, Get, Param } from '@nestjs/common';
import { SemProcessService } from './sem_process.service';
import { CONTROLLER_PROCESS_ID } from '../../client/src/utils/globals';

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

  // Add other endpoints as needed
}
