import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { PATTERN } from '../constants';
import { JwtService } from '@nestjs/jwt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async findByUsername(userName: string): Promise<User> {
    return await this.findOne({ userName });
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async comparePasswordHashed(password: string, attempt: string): Promise<string>{
    return await bcrypt.compare(password, attempt)
  }

  // async isEmailValid(email: string): Promise<any> {
  //   try {
  //     const pattern = PATTERN;
  //     return await pattern.test(email);
  //   } catch (error) {
  //     this.logger.error(error);
  //   }
  // }

  isValidUserName(userName: string){
    const query = this.userRepository.createQueryBuilder('user');
    const isValidUserName = query
      .select('user')
      .where('user.username LIKE :username', { userName })
      .getOne();
    return isValidUserName;
  }

  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query
      .select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }

  async checkIfNumberIsDuplicate(phoneNumber: string){
    const phoneNumberExist = this.userRepository.createQueryBuilder('users')
    .select('phoneNumber')
    .where('users.phoneNumber LIKE :email', {phoneNumber})
    .getCount()
    return phoneNumberExist;
  }

  comparePassword(attempt: string, password: string) {
    return this.decodePassword(password) === attempt;
  }

  

  private decodePassword(password: string) {
    const jwtService = this.getJwtService();
    const realPassword = jwtService.decode(password) as {
      pwd: string;
    };
    return realPassword.pwd;
  }

  compareToken(attempt: string, token: string){
    return attempt === token;
  }


  async encodeToken(user: any) {
    const jwtService = this.getJwtService();

    const jwt = await jwtService.sign({
      id: user.id,
      email: user.email,
    });
    return jwt;
  }

  private getJwtService() {
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    return jwtService;
  }


}
