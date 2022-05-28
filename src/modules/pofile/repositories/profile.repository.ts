import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { Profile } from "../entities/profile.entity";


@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
    logger = new Logger(ProfileRepository.name);

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {
    super();
  }
}