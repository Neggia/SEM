import { Controller, Post, Body } from '@nestjs/common';
import { FixturesService, FixturesDto } from './fixtures.service';

const {
  CONTROLLER_FIXTURES_ID,
  CONTROLLER_FIXTURES_SYNC,
} = require('../../client/src/utils/globals');

@Controller(CONTROLLER_FIXTURES_ID)
export class FixturesController {
  constructor(private readonly semFixturesService: FixturesService) {}

  @Post(CONTROLLER_FIXTURES_SYNC)
  async sync(@Body() fixturesDto: FixturesDto) {
    return this.semFixturesService.sync(fixturesDto);
  }

  // Add other endpoints as needed
}
