import { Module } from "@nestjs/common";
import { UserRepository } from "../../modules/user/repositories/user.repository";
import { UserModule } from "../../modules/user/user.module";
import { PassportModule as JwtPassportModule } from "@nestjs/passport";
import { AuthConstants } from "../common/constants/auth.constant";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        UserModule,
        DatabaseModule,
        JwtPassportModule.register({
            defaultStrategy: AuthConstants.strategy
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: +process.env.JWT_EXPIRATION,
            }
        })
    ],
    providers: [JwtStrategy,UserRepository],
    exports: []
})
export class PassportModule{

}