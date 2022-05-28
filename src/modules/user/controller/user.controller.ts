import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProfileDto } from 'src/modules/pofile/dto/profile.dto';
import { CreateUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Post('/register')
  async create(@Body('createUserDto') createUserDto: CreateUserDto, @Body('createProfileDto') createProfileDto: CreateProfileDto): Promise<any> {
    try {
      const userCreated = this.userService.signUp(createUserDto, createProfileDto);
      this.logger.log({
        message: `/Post /user/register - created with success`,
      });
      return userCreated;
    } catch (e) {
      this.logger.error({
        message: `/Post /user/register - created - Something went wrong`,
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }

  @Get('email/verify/tokens/:token')
  async verify(@Param('token') token: string): Promise<any> {
    try {
      const emailVerified = await this.userService.verifyEmail(token);
      this.logger.log({
        message: `/Get /email/verify/:token - created with success`,
      });
      return emailVerified;
    } catch (e) {
      this.logger.error({
        message: `/Get /email/verify/:token - Something went wrong`,
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }
}
