import {  NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],  
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  
  });
  app.useStaticAssets(join(__dirname, '..', 'uploadsFiles'), {
    prefix: '/uploadsFiles', 
  });

 

  const config = new DocumentBuilder()
    .setTitle('Inventory API')
    .setDescription('Fixed Assets Management API')
    .setVersion('1.0')
    .addTag('Assets')
    .build();
  app.useGlobalPipes(new ValidationPipe());
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

