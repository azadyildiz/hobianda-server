import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ShopModule],
})
export class AppModule {}
