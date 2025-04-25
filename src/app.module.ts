import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './assets/asset.module';
import { Asset } from './assets/Entities/Asset.entity';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { UploadsModule } from './uploads/uploads.module';
import { Supplier } from './supplier/Entities/Supplier.entity';
import { Category } from './category/Entities/category.entity';
import { File } from './uploads/entities/file.entity';
import { Department } from './department/entities/department.entity';
import { DepartmentModule } from './department/department.module';
import { ServiceModule } from './service/service.module';
import { Service } from './service/entities/service.entity';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { BcryptService } from './auth/common/bcrypt.service';
import { UserRole } from './user-role/entities/user-role.entity';
import { InventoryModule } from './inventory/inventory.module';
import { StatusModule } from './status/status.module';
import { InventoryDetailsModule } from './inventory-details/inventory-details.module';
import { Inventory } from './inventory/entities/inventory.entity';
import { Status } from './status/entities/status.entity';
import { APP_GUARD } from '@nestjs/core';
import { InventoryLockGuard } from './inventory/guards/inventory-lock.guard';
import { InventoryService } from './inventory/inventory.service';
import { InventoryRepository } from './inventory/repositories/inventory.repository';
import { StatusRepository } from './status/repositories/status.repository';
import { InventoryGateway } from './inventory/inventory.gateway';
import { userRepository } from './user/repositories/user.repository';
import { DepartmentRepository } from './department/repositories/department.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { InventoryDetails } from './inventory-details/entities/inventory-details.entity';
import { SiteModule } from './site/site.module';
import { Site } from './site/Entities/site.entity';
import { LocationModule } from './location/location.module';
import { Location } from './location/entities/location.entity';
import { LocationHistoryModule } from './location-history/location-history.module';
import { LocationHistory } from './location-history/entities/location-history.entity';
import { AssetStatusModule } from './asset-status/asset-status.module';
import { AssetStatus } from './asset-status/entities/asset-status.entity';
import { InventoryStatus } from './inventory-status/entities/inventory-status.entity';
import { InventoryStatusRepository } from './inventory-status/repositories/inventory-status.repository';
import { InventoryStatusModule } from './inventory-status/inventory-status.module';
import { AffectationModule } from './affectation/affectation.module';
import { AffectationRepository } from './affectation/repositories/affectation.repository';
import { Affectation } from './affectation/entities/affectation.entity';
import { SiteRepository } from './site/Repositories/site.repository';
import { AnomalyModule } from './anomaly/anomaly.module';
import { Anomaly } from './anomaly/Entities/anomaly.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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

        entities: [Site,Department,Service,Location, Asset,File,Supplier,Category ,LocationHistory,AssetStatus, User,UserRole,Inventory,Status,InventoryStatus,Affectation,InventoryDetails,Anomaly], 
        synchronize: true, 
      }),
    }),
    SiteModule,
    DepartmentModule,
    ServiceModule,
    LocationModule,
    CategoryModule,
    SupplierModule,
    UploadsModule,
    AssetModule,
    LocationHistoryModule,
    AssetStatusModule,
    UserRoleModule,
    AuthModule,
    UserModule,
    UserRoleModule,
    InventoryModule,
    StatusModule,
    InventoryDetailsModule,
    InventoryStatusModule,
    AffectationModule,
    AnomalyModule,
    
    
    
   
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
    InventoryStatusRepository,
    DepartmentRepository,
    AffectationRepository,
    SiteRepository,
    {
      provide: APP_GUARD,
      useClass: InventoryLockGuard,
    },
  ],
})
export class AppModule {
 
}

