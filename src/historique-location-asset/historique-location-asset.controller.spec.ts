import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqueLocationAssetController } from './historique-location-asset.controller';

describe('HistoriqueLocationAssetController', () => {
  let controller: HistoriqueLocationAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriqueLocationAssetController],
    }).compile();

    controller = module.get<HistoriqueLocationAssetController>(HistoriqueLocationAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
