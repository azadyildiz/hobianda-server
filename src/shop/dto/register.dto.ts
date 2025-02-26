import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, max, MaxLength, MinLength } from 'class-validator';

@ApiSchema({ name: 'Shop Register Request' })
export class RegisterDto {
  @ApiProperty({description: 'Shop name', example: 'Hobianda Poligon', required: true, type: 'string'})
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({description: 'Shop phone number', example: '+90 535 123 45 67', required: true, type: 'string'})
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TR')
  phone: string;

  @ApiProperty({description: 'Shop password', example: '123456', required: true, type: 'string'})
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty({description: 'Shop logo', example: 'logo.png', type: 'string'})
  @IsOptional()
  logo: Express.Multer.File;
}
