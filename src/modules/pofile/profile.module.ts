import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileController } from "./controller/profile.controller";
import { ProfileRepository } from "./repositories/profile.repository";
import { ProfileService } from "./service/profile.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProfileRepository]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService]
    
})
export class ProfileModule {

}