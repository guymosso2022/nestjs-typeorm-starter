import { Body, Controller, HttpException, Logger, Param, Post } from "@nestjs/common";
import { LoginProfilDto } from "../dto/login-profil.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../service/auth.service";

@Controller('auths')
export class AuthController {
    private logger = new Logger(AuthController.name);
    constructor(
        private authService: AuthService
    ){}

    @Post('login')
    async loginUser(@Body() loginDto: LoginDto){
        try {
            const userCreated = this.authService.loginUser(loginDto);
            this.logger.log({
              message: `/Post /auth/sig - connecting user`,
            });
            return userCreated;
          } catch (e) {
            this.logger.error({
              message: `/Post /auth/sign  - connecting user`,
              errors: e,
            });
            throw new HttpException(e.message, e.status);
          }
    }    

    @Post('/profiles/token')
    async loginProfile(
        @Body() loginProfilDto: LoginProfilDto
        ){
        try {
            const userCreated = this.authService.loginProfile(loginProfilDto);
            this.logger.log({
              message: `/Post /auths/profiles/token - connecting user`,
            });
            return userCreated;
          } catch (e) {
            this.logger.error({
              message: `/Post /auths/profiles/token  - connecting user`,
              errors: e,
            });
            throw new HttpException(e.message, e.status);
          }
    }   
}