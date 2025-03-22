import { Test, TestingModule } from '@nestjs/testing';
import { HistoryStatusAssetController } from './history-status-asset.controller';

describe('HistoryStatusAssetController', () => {
  let controller: HistoryStatusAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryStatusAssetController],
    }).compile();

    controller = module.get<HistoryStatusAssetController>(HistoryStatusAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
