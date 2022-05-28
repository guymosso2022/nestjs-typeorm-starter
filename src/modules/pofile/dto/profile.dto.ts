import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Gender } from "src/shared/common/enums/gender.enum";

export class CreateProfileDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    gender: Gender;

    @IsNumber()
    age: number;

    @IsString()
    country: string;

    @IsString()
    city: string;

    @IsString()
    address: string;

    @IsString()
    image: string;

    @IsNotEmpty({ message: 'L\'email est requis'})
    @IsEmail()
    email: string;
}