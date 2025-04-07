import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAssignmentService } from './inventory-assignment.service';

describe('InventoryAssignmentService', () => {
  let service: InventoryAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryAssignmentService],
    }).compile();

    service = module.get<InventoryAssignmentService>(InventoryAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
