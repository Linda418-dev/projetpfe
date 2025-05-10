import { Test, TestingModule } from '@nestjs/testing';
import { AnomalyStatusService } from './anomaly-status.service';

describe('AnomalyStatusService', () => {
  let service: AnomalyStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnomalyStatusService],
    }).compile();

    service = module.get<AnomalyStatusService>(AnomalyStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
