import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ShopController],
  providers: [ShopService, PrismaService],
})
export class ShopModule {}
