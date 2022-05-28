import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProfileModule } from "../pofile/profile.module";
import { UserRepository } from "../user/repositories/user.repository";
import { UserModule } from "../user/user.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";

@Module({
    imports: [UserModule, ProfileModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule{

}