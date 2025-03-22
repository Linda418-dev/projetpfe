import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStatusAssetService } from './history-status-asset.service';

describe('HistoryStatusAssetService', () => {
  let service: HistoryStatusAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryStatusAssetService],
    }).compile();

    service = module.get<HistoryStatusAssetService>(HistoryStatusAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
