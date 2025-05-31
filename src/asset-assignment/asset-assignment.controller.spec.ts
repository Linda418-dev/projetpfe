import { Test, TestingModule } from '@nestjs/testing';
import { AssetAssignmentController } from './asset-assignment.controller';

describe('AssetAssignmentController', () => {
  let controller: AssetAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetAssignmentController],
    }).compile();

    controller = module.get<AssetAssignmentController>(AssetAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
