import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOpenaiController } from './service_openai.controller';

describe('ServiceOpenaiController', () => {
  let controller: ServiceOpenaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOpenaiController],
    }).compile();

    controller = module.get<ServiceOpenaiController>(ServiceOpenaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
