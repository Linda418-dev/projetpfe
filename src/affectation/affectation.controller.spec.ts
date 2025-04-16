import { Test, TestingModule } from '@nestjs/testing';
import { AffectationController } from './affectation.controller';

describe('AffectationController', () => {
  let controller: AffectationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffectationController],
    }).compile();

    controller = module.get<AffectationController>(AffectationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
