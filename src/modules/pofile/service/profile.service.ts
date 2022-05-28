import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Role } from "src/shared/common/enums/role.enum";
import { Repository } from "typeorm";
import { CreateProfileDto } from "../dto/profile.dto";
import { Profile } from "../entities/profile.entity";
import { ProfileRepository } from "../repositories/profile.repository";

@Injectable()
export class ProfileService {

  logger = new Logger(ProfileService.name);
  constructor(
    private profileRepository: ProfileRepository) {
  }

  async getProfilebyId(id: string): Promise<Profile>{
    try{
      console.log("id",id)
      const profile = await this.profileRepository.findOne(id)
      console.log("profile",profile)
      if (!profile) {
        throw new HttpException('profile does not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    }catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async createProfile(user: User, createProfileDto: CreateProfileDto){
    try{
      const {
        firstName,
        lastName,
        age,
        phoneNumber,
        gender,
        country,
        city,
        address,
        email
      } = createProfileDto;
      const profile = new Profile();
      profile.firstName  = firstName;
      profile.lastName = lastName;
      profile.age  = age;
      profile.phoneNumber = phoneNumber;
      profile.gender = gender;
      profile.country = country;
      profile.city = city;
      profile.address = address;
      profile.roles = [Role.USER];
      profile.user = user;
      profile.email = email;
      return await profile.save()
    }catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
    
  }

  async getProfileData(user: User): Promise<Profile> {
    try{
      const profile = await this.profileRepository.findOne({
        where: {
          id: user.profile,
        },
      });
      if (!profile) {
        throw new HttpException('profile does not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    }catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async updateProfile(id: string, createProfileDto: CreateProfileDto){
    try{
      const profile = await this.profileRepository.findOne(id);
      
      if(!profile){
        throw new HttpException('profile does not found',HttpStatus.NOT_FOUND);
      }
      Object.assign(profile, createProfileDto);
      const createdProfile =  this.profileRepository.update(id,profile);
      return createdProfile;
    }catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async deleteProfile(id: number): Promise<void> {
    try{
      const result = await this.profileRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('profile does not found',HttpStatus.NOT_FOUND);
      }
    }catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
    
  }  
}