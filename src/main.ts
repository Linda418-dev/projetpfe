import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],  
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],  
    credentials: true,  
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

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
