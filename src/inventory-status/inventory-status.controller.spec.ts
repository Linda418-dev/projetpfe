import { Test, TestingModule } from '@nestjs/testing';
import { InventoryStatusController } from './inventory-status.controller';

describe('InventoryStatusController', () => {
  let controller: InventoryStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryStatusController],
    }).compile();

    controller = module.get<InventoryStatusController>(InventoryStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
