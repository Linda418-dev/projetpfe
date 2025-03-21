import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAssetController } from './history-asset.controller';

describe('HistoryAssetController', () => {
  let controller: HistoryAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryAssetController],
    }).compile();

    controller = module.get<HistoryAssetController>(HistoryAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
