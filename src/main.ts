import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // http://localhost:4201 pour le container local du front pout le test
  // http://148.113.24.178:4201 l'adresse ip de serveur du front 

  app.enableCors({
    origin: ['http://localhost:4200','http://localhost:4201','http://148.113.24.178:4201'],  
    methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],  
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],  
    credentials: true,  
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  const config = new DocumentBuilder()
  .setTitle('Inventory API')
  .setDescription('Fixed Assets Management API')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
  })
  .build();
   
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,  
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
