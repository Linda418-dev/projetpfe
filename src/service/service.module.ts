import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceRepository } from './repositories/service.repository';
import { DepartmentRepository } from 'src/department/repositories/department.repository';
import { AssetRepository } from 'src/assets/Repositories/Asset.repository';
import { AssetsService } from 'src/assets/asset.service';
import { FileRepository } from 'src/uploads/repositories/file.repository';
import { CategoryRepository } from 'src/category/Repositories/category.repository';
import { SupplierRepository } from 'src/supplier/Repositories/Supplier.repository';
import { LocationRepository } from 'src/location/repositories/location.repository';
import { LocationHistoryRepository } from 'src/location-history/repositories/location-history.repository';
import { AssetStatusRepository } from 'src/asset-status/repositories/asset-status.repository';
import { StatusRepository } from 'src/status/repositories/status.repository';
import { userRepository } from 'src/user/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { InventoryDetailsRepository } from 'src/inventory-details/repositories/inventory-details.repository';
import { AssetAssignmentRepository } from 'src/asset-assignment/repositories/asset-assignment.repository';

@Module({
  providers: [ServiceService,ServiceRepository, DepartmentRepository,LocationRepository, AssetRepository,AssetsService,FileRepository,CategoryRepository,SupplierRepository
    ,LocationHistoryRepository,AssetStatusRepository,StatusRepository,userRepository,ConfigService ,InventoryDetailsRepository,AssetAssignmentRepository
  ],
  controllers: [ServiceController]
})
export class ServiceModule {}
