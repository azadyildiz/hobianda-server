import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ShopService } from './shop.service';
import { RegisterDto } from './dto/register.dto';
import { RequestCodeDto } from './dto/request-code.dto';
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
  async requestCode(@Body() requestCodeDto: RequestCodeDto) {
    return this.shopService.requestCode(requestCodeDto);
  }

  @Post('verify-code')
  async verifyCode() {
    return this.shopService.verifyCode();
  }
}
