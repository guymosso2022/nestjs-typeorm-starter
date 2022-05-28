
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/shared/common/enums/role.enum';
import { EmailVerification } from '../entities/email-verification.entity';
import { User } from '../entities/user.entity';
import { EmailVerificationRepository } from '../repositories/email-verification.repository';
import { UserRepository } from '../repositories/user.repository';
import { MailService } from 'src/shared/mail/service/mail.service';
import { CreateUserDto } from '../dto/user.dto';
import { CreateProfileDto } from 'src/modules/pofile/dto/profile.dto';
import { Profile } from 'src/modules/pofile/entities/profile.entity';
import { ProfileService } from 'src/modules/pofile/service/profile.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private emailVerificationRepository: EmailVerificationRepository,
    private mailService:  MailService,
    private profileService: ProfileService
  ) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne(userId);
      return user;
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new HttpException('The user not found!', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async signUp(createUserDto: CreateUserDto, createProfileDto: CreateProfileDto){
    try {
      const userCreated = await this.createdUser(createUserDto);
      await this.profileService.createProfile( userCreated, createProfileDto);
      const createdEmailToken = await this.createEmailToken(userCreated.email);
      await this.mailService.sendEmailVerification(createdEmailToken);
      return { message: 'A message has been sent to your email' };
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  private async createdUser(createUserDto: CreateUserDto){
    try{
      const { lastName, firstName, phoneNumber, userName, email, password } = createUserDto;
      const user = new User();
      user.salt = await bcrypt.genSalt();
      // user.roles = [Role.USER];
      user.lastName = lastName;
      user.firstName = firstName;
      user.phoneNumber = await this.checkIfNumberIsDuplicate(phoneNumber, user);
      user.password = await this.userRepository.hashPassword(
        password,
        user.salt
      );
      user.email = email;
      user.userName = userName;
      const userCreated =  user.save();
      return userCreated;
    } catch(e){
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async verifideEmail(emailVerification: EmailVerification){
    const verifiedEmail = await this.emailVerificationRepository.findOne(emailVerification.email);
    if(verifiedEmail && verifiedEmail.emailToken){
      await this.mailService.sendEmailVerification(emailVerification);
    }else{
      throw new HttpException('user not registred', HttpStatus.FORBIDDEN);
    }
    this.logger.log({
      message: 'The user  email sent  with success',
    });
  }

  async checkIfEmailExist(email: string, user: User){
    if (await this.userRepository.checkIfEmailExist(email)) {
        throw new HttpException(
          `The email ${email} is not available, please try another one`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        user.email = email;
      }
  }

  async checkIfUserNameExist(userName: string, user: User){
    if (!this.isValidUserName(userName)) {
        throw new HttpException(
          `The username ${userName} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        user.userName = userName;
      }
  }
  async isValidUserName(userName: string): Promise<any>{
    const query = this.userRepository.createQueryBuilder('users');
    
    const isValidUserName = query
      .select('users')
      .where('users.userName LIKE :userName', { userName })
      .getOne();
    return isValidUserName;
  }

  async createEmailToken(email: string): Promise<EmailVerification>{
    try {
      
      const verifiedEmail = await this.emailVerificationRepository.findOne({
        email,
      });
      if (
        verifiedEmail &&
        (new Date().getTime() - verifiedEmail.timestamp.getTime()) / 60000 < 15
      ) {
        throw new HttpException(
          'Login email sent recently',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return await this.createNewEmailverification(email)
      }
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  private async createNewEmailverification(email: string): Promise<EmailVerification>{
    try {
      const newEmailVerification = new EmailVerification();
        newEmailVerification.email = email;
        const payload = {token: (
          Math.floor(Math.random() * 900000) + 100000
        ).toString(),
        email: email
      }
        const token = this.jwtService.sign({payload});
        newEmailVerification.emailToken = token;
        newEmailVerification.timestamp = new Date();
        return await newEmailVerification.save();
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  async verifyEmail(
    token: string
  ): Promise<{ isFullyVerified: boolean; user: User }>{
    try {
      const decodeToken = token;
      const emailToken = this.jwtService.decode(decodeToken) as { payload: string};
      console.log("token",emailToken.payload['email'])
      const verifiedEmail = await this.emailVerificationRepository.findOne({email: emailToken.payload['email']});
      console.log(verifiedEmail)
      if (verifiedEmail && verifiedEmail.email) {
        const user = await this.userRepository.findOne({
          email: verifiedEmail.email,
        });
        if (user) {
          const usertoUpdate = {
            ...user,
            isEmailVerified:true
          };
          Object.assign(user,  usertoUpdate);
          const updatedUser = await user.save();
          await verifiedEmail.remove();
          return { isFullyVerified: true, user: updatedUser };
        }
      } else {
        throw new HttpException(
          'logn email code not valid',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  private async checkIfNumberIsDuplicate(phoneNumber: string, user: User){
    if (!this.isValidUserName(phoneNumber)) {
      throw new HttpException(
        `The username ${phoneNumber} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
     return user.phoneNumber = phoneNumber;
    }
  }

  async createProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile>{
    const {
        firstName,
        lastName,
        age,
        phoneNumber,
        gender,
        country,
        city,
        address
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
    profile.user = user;
    return await profile.save();
  }
  async comparePassword(password: string, attempt: string){
    return await this.userRepository.comparePasswordHashed(password, attempt)
  }
}
