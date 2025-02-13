import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { saveLogoToServer, deleteLogoFromServer } from './utils/logo.utils';
import { getVerificationCode, getCodeExpiryTime } from './utils/verification.utils';
import * as bcrypt from 'bcrypt';
import { t } from '../common/helpers/i18n.helper';

@Injectable()
export class ShopService {
  constructor(private prismaService: PrismaService) {}

  async register(registerDto: RegisterDto, logo?: Express.Multer.File) {
    let logoPath: string | null = null;
    try {
      // check if phone already exists
      const existingShop = await this.prismaService.shop.findFirst({
        where: { phone: registerDto.phone },
      });
      if (existingShop) {
        throw new ConflictException(t('auth.error.conflict'));
      }

      // Save logo to server (if applicable)
      if (logo) {
        logoPath = saveLogoToServer(logo);
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // save to database
      await this.prismaService.shop.create({
        data: {
          name: registerDto.name,
          phone: registerDto.phone,
          password: hashedPassword,
          logo: logoPath,
        },
      });

      // response
      return {
        message: t('auth.success.register'),
        data: {},
      };
    } catch (error) {
      console.log(error);
      // Delete logo from server on error (if saved)
      if (logoPath) {
        deleteLogoFromServer(logoPath);
      }

      // Handle error
      throw new InternalServerErrorException(t('common.error.default'));
    }
  }
  async login() {
    return 'login';
  }
  async requestCode() {
    return 'requestCode';
  }
  async verifyCode() {
    return 'verifyCode';
  }
}
