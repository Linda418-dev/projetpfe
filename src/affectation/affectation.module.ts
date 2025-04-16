import { Module } from '@nestjs/common';
import { AffectationService } from './affectation.service';
import { AffectationController } from './affectation.controller';
import { AffectationRepository } from './repositories/affectation.repository';

@Module({
  providers: [AffectationService,AffectationRepository],
  controllers: [AffectationController]
})
export class AffectationModule {}
