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
import { PlaceRepository } from 'src/places/Repositories/Place.repository';
import { PaginationService } from 'src/pagination/pagination.service';
import { HistoryAssetRepository } from 'src/history-asset/repositories/history-asset.repository';

@Module({
  providers: [ServiceService,ServiceRepository, DepartmentRepository, AssetRepository,AssetsService,FileRepository,CategoryRepository,SupplierRepository
    ,PlaceRepository,PaginationService,HistoryAssetRepository
  ],
  controllers: [ServiceController]
})
export class ServiceModule {}
