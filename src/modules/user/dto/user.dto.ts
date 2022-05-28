import { IsBoolean, IsEmail, IsEmpty, IsString } from 'class-validator';
import { Auth } from 'src/shared/common/classes/auth';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  userName: string;

  @IsString()
  password: string;

  @IsEmpty({ message: 'L\'email est requis'})
  @IsEmail()
  email: string;

  @IsString()
  salt: string;

  @IsBoolean()
  isEmailVerified: boolean;

  @IsString()
  gmailId: string;

  @IsString()
  facebookId: string;


}
