import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStatusHistoryService } from './inventory-status-history.service';

describe('InventoryStatusHistoryService', () => {
  let service: InventoryStatusHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryStatusHistoryService],
    }).compile();

    service = module.get<InventoryStatusHistoryService>(InventoryStatusHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
