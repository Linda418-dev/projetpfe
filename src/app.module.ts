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
import { HistoriqueLocationAssetModule } from './historique-location-asset/historique-location-asset.module';
import { HistoriqueLocationAsset } from './historique-location-asset/entities/historique-location-asset.entity';

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

        entities: [Place,Asset,File,Supplier,Category,HistoriqueLocationAsset], 
        synchronize: true, 
      }),
    }),
    AssetModule,
    PlacesModule,
    CategoryModule,
    SupplierModule,
    UploadsModule,
    HistoriqueLocationAssetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
 
}

