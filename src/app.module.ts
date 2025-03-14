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
import { DataSource } from 'typeorm';
import { Supplier } from './supplier/Entities/Supplier.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Category } from './category/Entities/category.entity';
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
        entities: [Place,Asset,File,Supplier,Category], 
        synchronize: true, 
      }),
    }),
    PlacesModule,
    AssetModule,
    CategoryModule,
    CategoryModule,
    SupplierModule
    
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {
 
}
