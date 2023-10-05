import { Test, TestingModule } from '@nestjs/testing';
import { UtsController } from './uts.controller';

describe('UtsController', () => {
  let controller: UtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtsController],
    }).compile();

    controller = module.get<UtsController>(UtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
