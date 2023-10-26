import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOpenaiService } from './service_openai.service';

describe('ServiceOpenaiService', () => {
  let service: ServiceOpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceOpenaiService],
    }).compile();

    service = module.get<ServiceOpenaiService>(ServiceOpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
