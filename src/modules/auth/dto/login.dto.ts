import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail()
  email: string;
  
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
  password: string;
}