import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ShopService } from './shop.service';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('logo'))
  async register(@Body() registerDto: RegisterDto, @UploadedFile() logo?: Express.Multer.File) {
    return this.shopService.register(registerDto, logo);
  }

  @Post('login')
  async login() {
    return this.shopService.login();
  }

  @Post('request-code')
  async requestCode() {
    return this.shopService.requestCode();
  }

  @Post('verify-code')
  async verifyCode() {
    return this.shopService.verifyCode();
  }
}
