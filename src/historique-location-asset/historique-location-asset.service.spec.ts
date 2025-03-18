import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqueLocationAssetService } from './historique-location-asset.service';

describe('HistoriqueLocationAssetService', () => {
  let service: HistoriqueLocationAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoriqueLocationAssetService],
    }).compile();

    service = module.get<HistoriqueLocationAssetService>(HistoriqueLocationAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
