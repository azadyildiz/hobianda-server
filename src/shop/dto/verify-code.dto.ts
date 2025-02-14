import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TR')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsPositive()
  @IsNumber({}, { message: 'Verification code must be a number' })
  @Min(100000, { message: 'Verification code must be exactly 6 digits' })
  @Max(999999, { message: 'Verification code must be exactly 6 digits' })
  @IsNotEmpty({ message: 'Verification code is required' })
  verificationCode: number;
}
