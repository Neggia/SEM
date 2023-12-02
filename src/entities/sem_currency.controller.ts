import { Controller, Get, Param } from '@nestjs/common';
import { SemCurrencyService } from './sem_currency.service';

const { CONTROLLER_CURRENCY_ID } = require('../../client/src/utils/globals');

@Controller(CONTROLLER_CURRENCY_ID)
export class SemCurrencyController {
  constructor(private readonly semCurrencyService: SemCurrencyService) {}

  @Get()
  findAll() {
    return this.semCurrencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semCurrencyService.findOne(+id);
  }

  // Add other endpoints as needed
}
