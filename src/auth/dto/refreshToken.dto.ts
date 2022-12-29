import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'You didnt pass refresh token or its not a string' })
  refreshToken: string;
}
