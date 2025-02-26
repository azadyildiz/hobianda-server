import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configs
  const config = new DocumentBuilder()
    .setTitle('Hobianda API')
    .setDescription('Hobianda API description')
    .setVersion('1.0')
    .addTag('hobianda')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Register global exception filters for HTTP and Prisma errors.
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter());

  // Register the global response interceptor to format all successful responses.
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global ValidationPipe ekle
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
