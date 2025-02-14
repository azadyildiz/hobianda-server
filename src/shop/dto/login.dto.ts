import { IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TR')
  phone: string;

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
