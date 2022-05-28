import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginProfilDto {
  @IsNotEmpty({ message: "Le token est requis" })
  @IsEmail()
  token: string;
}