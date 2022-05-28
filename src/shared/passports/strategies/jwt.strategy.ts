import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt  } from 'passport-jwt'
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { AuthConstants } from "src/shared/common/constants/auth.constant";
import { Payload } from "../interface/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private readonly userRepository: UserRepository){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: AuthConstants.secretKey,
        });
    }


    async validate(payload: Payload) {
        const { email } = payload;
        if (!email) {
          this.logger.error({ message: "Jeton d'accès invalide." });
          throw new HttpException(
            {
              message: "Jeton d'accès invalide.",
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
    
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
          this.logger.error({
            message:
              'Pour avoir accès à cette ressource vous devez vous authentifier.',
          });
          throw new HttpException(
            {
              message:
                'Pour avoir accès à cette ressource vous devez vous authentifier.',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        return user;
    }
}


