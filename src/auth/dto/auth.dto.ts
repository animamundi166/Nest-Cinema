import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password cant be less 6 characters' })
  password: string;
}
