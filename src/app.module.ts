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
import { HistoryStatusAssetModule } from './history-status-asset/history-status-asset.module';
import { HistoryStatusAsset } from './history-status-asset/entities/history-status-Asset.entity';
import { HistoryAssetModule } from './history-asset/history-asset.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { BcryptService } from './common/bcrypt.service';
import { CommonModule } from './common/common.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { UserRole } from './user-role/entities/user-role.entity';

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

        entities: [Place,Asset,File,Supplier,Category ,Department,Service,HistoryAsset,HistoryStatusAsset,User,UserRole], 
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
    HistoryStatusAssetModule,
    HistoryAssetModule,
    UserRoleModule,
    AuthModule,
    UserModule,
    UserRoleModule,
    CommonModule,
    JwtAuthModule
    
    
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService],
})
export class AppModule {
 
}

