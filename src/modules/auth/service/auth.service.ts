import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ProfileService } from "src/modules/pofile/service/profile.service";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { UserService } from "src/modules/user/service/user.service";
import { LoginProfilDto } from "../dto/login-profil.dto";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private profileService: ProfileService

    ){}

    async loginUser(loginDto: LoginDto){
        try{
            
            const { email, password} = loginDto;

            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException(
                  'This user was not found',
                  HttpStatus.NOT_FOUND,
                );
            }

            const compare = this.userService.comparePassword(password, user.password);
            if (!compare) {
                throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
            }
            if (user && compare) {
                if (user.isEmailVerified === false) {
                // const token = this.jwtService.sign({ email });
                return {
                    message: `Email not verified`,
                    statusCode: HttpStatus.UNAUTHORIZED,
                };
                }
                const jwt = await this.encodeToken(user);
                // const usertoUpdate = {
                //     ...user,
                //     token: jwt
                // };
                // Object.assign(user,  usertoUpdate);
                // const updatedUser = await user.save();
                const realExp = this.jwtService.decode(jwt) as {
                exp: string;
                };
                const exp = realExp.exp as string;
                const result = {
                user: user,
                accessTokenUser: jwt,
                exp,
                };
                this.logger.log({
                message: 'Works with success',
                });
                return result;
            }

        }catch(e){
            this.logger.error({
                message: 'Something went wrong',
                errors: e,
            });
            throw new HttpException(e.message, e.status);
        }
    }


    async loginProfile(loginProfilDto: LoginProfilDto){
        try{
            const { token } = loginProfilDto;
            const decodeToken = this.jwtService.decode(token) as {
                email: string;
                id: string;

            };
            
            const user = await this.userService.getUserByEmail(decodeToken.email);
            

            
            if(user && this.jwtService.verify(token)){
                const profile = await this.profileService.getProfilebyId(user.profile[0].id);
                console.log(" user", profile.roles)

                  const token = this.jwtService.sign({profile});
                // console.log("decodeToken",profile)
                //const jwt = this.jwtService.sign(profile);
                
                // const realExp = this.jwtService.decode(jwt) as {
                // exp: string;
                // };
                const result = {
                user: user,
                accessTokenProfile: token
                };
                this.logger.log({
                message: 'Works with success',
                });
                return result;

            }

        }catch(e){
            this.logger.error({
                message: 'Something went wrong',
                errors: e,
            });
            throw new HttpException(e.message, e.status);
        }


        
    }

    comparePassword(attempt: string, password: string) {
        return this.decodePassword(password) === attempt;
    }
    
      
    
    private decodePassword(password: string) {
        console.log("password",password)
    const realPassword = this.jwtService.decode(password) as {
        password: string;
    };
    console.log("realPassword",realPassword)
    return realPassword.password;
    }

    compareToken(attempt: string, token: string){
        return attempt === token;
    }
    
    
      async encodeToken(user: any) {
    
        const jwt = this.jwtService.sign({
          id: user.id,
          email: user.email,
        });
        return jwt;
      }

    
}