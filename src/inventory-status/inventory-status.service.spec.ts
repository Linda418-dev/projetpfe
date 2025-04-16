import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStatusService } from './inventory-status.service';

describe('InventoryStatusService', () => {
  let service: InventoryStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryStatusService],
    }).compile();

    service = module.get<InventoryStatusService>(InventoryStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
