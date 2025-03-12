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
import { UploadsModule } from './uploads/uploads.module';
import { DataSource } from 'typeorm';
import { File } from './uploads/entities/file.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule,UploadsModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [Place,Asset,File], 
        synchronize: true, 
      }),
    }),
    PlacesModule,
    AssetModule,
    CategoryModule,
    UploadsModule
    
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('📌 Entities loaded:', this.dataSource.entityMetadatas.map(e => e.name));
  }
}
