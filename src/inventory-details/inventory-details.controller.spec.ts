import { Test, TestingModule } from '@nestjs/testing';
import { InventoryDetailsController } from './inventory-details.controller';

describe('InventoryDetailsController', () => {
  let controller: InventoryDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryDetailsController],
    }).compile();

    controller = module.get<InventoryDetailsController>(InventoryDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
