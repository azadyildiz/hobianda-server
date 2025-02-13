import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RequestCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TR')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
