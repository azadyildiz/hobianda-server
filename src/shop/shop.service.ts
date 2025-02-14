import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
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
      const existingShop = await this.prismaService.shop.findUnique({
        where: { phone: registerDto.phone },
      });
      if (existingShop) {
        throw new ConflictException(t('auth.error.registerConflict'));
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
      // Delete logo from server on error (if saved)
      if (logoPath) {
        deleteLogoFromServer(logoPath);
      }

      throw error;
    }
  }
  async login() {
    return 'login';
  }

  async requestCode(requestCodeDto: RequestCodeDto) {
    try {
      const { phone, password } = requestCodeDto;
      const shop = await this.prismaService.shop.findUnique({
        where: { phone },
      });

      // Check if shop exists
      if (!shop) {
        throw new NotFoundException(t('auth.error.notFound'));
      }

      // Check if password is not correct
      const isPasswordCorrect = await bcrypt.compare(password, shop.password);
      if (!isPasswordCorrect) {
        throw new NotFoundException(t('auth.error.notFound'));
      }

      // Check if shop is already verified
      if (shop.isVerified) {
        throw new ConflictException(t('auth.error.verifyConflict'));
      }

      // Generate verification code
      const verificationCode = getVerificationCode();
      const codeExpiry = getCodeExpiryTime();

      // TODO: Send verification code to phone (e.g. SMS) in production
      console.log(`Phone number: ${phone}, verification code: ${verificationCode}`);

      // update shop with verificationCode and codeExpiry
      await this.prismaService.shop.update({
        where: { phone },
        data: {
          verificationCode,
          codeExpiry,
        },
      });

      // Response
      return {
        message: t('auth.success.requestCode'),
        // TODO: Remove verificationCode from response in production
        data: { verificationCode },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    try {
      const { phone, password, verificationCode } = verifyCodeDto;

      const shop = await this.prismaService.shop.findUnique({
        where: { phone },
      });

      // Check if shop exists
      if (!shop) {
        throw new NotFoundException(t('auth.error.notFound'));
      }

      // Check if password is not correct
      const isPasswordCorrect = await bcrypt.compare(password, shop.password);
      if (!isPasswordCorrect) {
        throw new NotFoundException(t('auth.error.notFound'));
      }

      // Check if shop is already verified
      if (shop.isVerified) {
        throw new ConflictException(t('auth.error.verifyConflict'));
      }

      // check if code is not correct
      if (shop.verificationCode !== verificationCode) {
        throw new ConflictException(t('auth.error.codeConflict'));
      }

      // check if code expired
      if (!shop.codeExpiry || shop.codeExpiry < new Date()) {
        throw new ConflictException(t('auth.error.codeExpired'));
      }

      // update shop as verified
      await this.prismaService.shop.update({
        where: { phone },
        data: {
          isVerified: true,
          verificationCode: null,
          codeExpiry: null,
        },
      });

      return {
        message: t('auth.success.verifyCode'),
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }
}
