import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
