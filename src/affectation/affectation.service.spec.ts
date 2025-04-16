import { Test, TestingModule } from '@nestjs/testing';
import { AffectationService } from './affectation.service';

describe('AffectationService', () => {
  let service: AffectationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffectationService],
    }).compile();

    service = module.get<AffectationService>(AffectationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
