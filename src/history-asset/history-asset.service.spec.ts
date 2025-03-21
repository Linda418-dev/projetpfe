import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAssetService } from './history-asset.service';

describe('HistoryAssetService', () => {
  let service: HistoryAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAssetService],
    }).compile();

    service = module.get<HistoryAssetService>(HistoryAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
