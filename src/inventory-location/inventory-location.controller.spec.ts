import { Test, TestingModule } from '@nestjs/testing';
import { InventoryLocationController } from './inventory-location.controller';

describe('InventoryLocationController', () => {
  let controller: InventoryLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryLocationController],
    }).compile();

    controller = module.get<InventoryLocationController>(InventoryLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
