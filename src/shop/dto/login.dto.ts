import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
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
}
