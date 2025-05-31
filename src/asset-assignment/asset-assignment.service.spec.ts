import { Test, TestingModule } from '@nestjs/testing';
import { AssetAssignmentService } from './asset-assignment.service';

describe('AssetAssignmentService', () => {
  let service: AssetAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetAssignmentService],
    }).compile();

    service = module.get<AssetAssignmentService>(AssetAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
