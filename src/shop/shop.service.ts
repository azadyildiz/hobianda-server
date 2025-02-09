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
      // Save logo to server (if applicable)
      if (logo) {
        logoPath = saveLogoToServer(logo);
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // get verificationCode and codeExpiry
      const verificationCode = getVerificationCode();
      const codeExpiry = getCodeExpiryTime();

      // save to database
      await this.prismaService.shop.create({
        data: {
          name: registerDto.name,
          phone: registerDto.phone,
          password: hashedPassword,
          logo: logoPath,
          verificationCode,
          codeExpiry,
        },
      });

      // send verificationCode to sms
      // TODO add sms service and send real sms
      console.log(`SMS sent to ${registerDto.phone} with code: ${verificationCode}`);

      // response
      return {
        message: t('shop.success.register'),
        data: {},
      };
    } catch (error) {
      console.log(error);
      // Delete logo from server on error (if saved)
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
