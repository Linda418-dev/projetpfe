import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStatusHistoryController } from './inventory-status-history.controller';

describe('InventoryStatusHistoryController', () => {
  let controller: InventoryStatusHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryStatusHistoryController],
    }).compile();

    controller = module.get<InventoryStatusHistoryController>(InventoryStatusHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
