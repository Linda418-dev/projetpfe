import { Module } from '@nestjs/common';
import { AffectationService } from './affectation.service';
import { AffectationController } from './affectation.controller';

@Module({
  providers: [AffectationService],
  controllers: [AffectationController]
})
export class AffectationModule {}
