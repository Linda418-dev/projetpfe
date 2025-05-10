import { Test, TestingModule } from '@nestjs/testing';
import { AnomalyStatusController } from './anomaly-status.controller';

describe('AnomalyStatusController', () => {
  let controller: AnomalyStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnomalyStatusController],
    }).compile();

    controller = module.get<AnomalyStatusController>(AnomalyStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
