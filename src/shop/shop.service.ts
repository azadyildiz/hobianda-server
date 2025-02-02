import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { saveLogoToServer, deleteLogoFromServer } from './utils/logo.utils';

@Injectable()
export class ShopService {
  constructor(private prismaService: PrismaService) {}

  async register(registerDto: RegisterDto, logo?: Express.Multer.File) {
    let logoPath: string | null = null;
    try {
      if (logo) {
        logoPath = saveLogoToServer(logo);
      }

      const shop = await this.prismaService.shop.create({
        data: {
          name: registerDto.name,
          phone: registerDto.phone,
          password: registerDto.password, // Gerçek uygulamada şifreyi hash'lemeniz gerekir
          logo: logoPath,
        },
      });
      return shop;
    } catch (error) {
      console.log(error);
      // Logo kaydedilmişse ve hata oluştuysa, logoyu sunucudan sil
      if (logoPath) {
        deleteLogoFromServer(logoPath);
      }

      // Prisma'nın döndüğü hataları handle et
      if (error.code === 'P2002') {
        throw new ConflictException('Bu telefon numarası zaten kayıtlı.');
      }

      // Diğer hatalar için genel bir hata mesajı
      throw new InternalServerErrorException('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
    }
  }
  async login(loginDto: LoginDto) {
    return 'login';
  }
  async requestCode() {
    return 'requestCode';
  }
  async verifyCode() {
    return 'verifyCode';
  }
}
