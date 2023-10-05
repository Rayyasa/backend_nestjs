import { Test, TestingModule } from '@nestjs/testing';
import { UtsService } from './uts.service';

describe('UtsService', () => {
  let service: UtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtsService],
    }).compile();

    service = module.get<UtsService>(UtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
