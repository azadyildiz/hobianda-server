import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export function saveLogoToServer(logo: Express.Multer.File): string {
  const uploadDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${uniqueSuffix}-${logo.originalname}`;
  const logoPath = path.join(uploadDir, filename);

  try {
    fs.writeFileSync(logoPath, logo.buffer);
    return logoPath;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('Logo kaydedilirken bir hata oluştu.');
  }
}

export function deleteLogoFromServer(logoPath: string): void {
  try {
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
  } catch (error) {
    // Logo silinirken hata oluşursa, bu hatayı loglayabilirsiniz
    console.error('Logo silinirken bir hata oluştu:', error);
  }
}
