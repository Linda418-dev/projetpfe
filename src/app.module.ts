import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './places/places.module';
import { Place } from './places/Entities/Place.entity';
import { AssetModule } from './assets/asset.module';
import { Asset } from './assets/Entities/Asset.entity';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { UploadsModule } from './uploads/uploads.module';
import { Supplier } from './supplier/Entities/Supplier.entity';
import { Category } from './category/Entities/category.entity';
import { File } from './uploads/entities/file.entity';
import { PaginationModule } from './pagination/pagination.module';
import { Department } from './department/entities/department.entity';
import { DepartmentModule } from './department/department.module';
import { ServiceModule } from './service/service.module';
import { Service } from './service/entities/service.entity';
import { HistoryAsset } from './history-asset/entities/history-Asset.entity';
import { HistoryAssetModule } from './history-asset/history-asset.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { BcryptService } from './auth/common/bcrypt.service';
import { UserRole } from './user-role/entities/user-role.entity';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryStatusHistoryModule } from './inventory-status-history/inventory-status-history.module';
import { StatusModule } from './status/status.module';
import { InventoryDetailsModule } from './inventory-details/inventory-details.module';
import { InventoryLocationModule } from './inventory-location/inventory-location.module';
import { Inventory } from './inventory/entities/inventory.entity';
import { Status } from './status/entities/status.entity';
import { APP_GUARD } from '@nestjs/core';
import { InventoryLockGuard } from './inventory/guards/inventory-lock.guard';
import { InventoryService } from './inventory/inventory.service';
import { InventoryRepository } from './inventory/repositories/inventory.repository';
import { StatusRepository } from './status/repositories/status.repository';
import { InventoryGateway } from './inventory/inventory.gateway';
import { userRepository } from './user/repositories/user.repository';
import { InventoryStatusHistory } from './inventory-status-history/entities/inventory-status-history.entity';
import { InventoryStatusHistoryRepository } from './inventory-status-history/repositories/inventory-status-history.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule,],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),

        entities: [Place,Asset,File,Supplier,Category ,Department,Service,HistoryAsset,User,UserRole,Inventory,Status,InventoryStatusHistory], 
        synchronize: true, 
      }),
    }),
    AssetModule,
    PlacesModule,
    CategoryModule,
    SupplierModule,
    UploadsModule,
    PaginationModule,
    DepartmentModule,
    ServiceModule,
    HistoryAssetModule,
    UserRoleModule,
    AuthModule,
    UserModule,
    UserRoleModule,
    InventoryModule,
    InventoryStatusHistoryModule,
    StatusModule,
    InventoryDetailsModule,
    InventoryLocationModule,
    
    
    
    
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    BcryptService,
    InventoryService,
    InventoryRepository,
    StatusRepository,
    InventoryGateway,
    userRepository,
    InventoryStatusHistoryRepository,
    {
      provide: APP_GUARD,
      useClass: InventoryLockGuard,
    },
  ],
})
export class AppModule {
 
}

