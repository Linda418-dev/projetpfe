import { Module } from '@nestjs/common';
import { AssetAssignmentController } from './asset-assignment.controller';
import { AssetAssignmentService } from './asset-assignment.service';

@Module({
  controllers: [AssetAssignmentController],
  providers: [AssetAssignmentService]
})
export class AssetAssignmentModule {}
