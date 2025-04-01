import { Test, TestingModule } from '@nestjs/testing';
import { InventoryDetailsService } from './inventory-details.service';

describe('InventoryDetailsService', () => {
  let service: InventoryDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryDetailsService],
    }).compile();

    service = module.get<InventoryDetailsService>(InventoryDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
