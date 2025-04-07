import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAssignmentController } from './inventory-assignment.controller';

describe('InventoryAssignmentController', () => {
  let controller: InventoryAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryAssignmentController],
    }).compile();

    controller = module.get<InventoryAssignmentController>(InventoryAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
