import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { EmailVerificationRepository } from './repositories/email-verification.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { DatabaseModule } from 'src/shared/database/database.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { ProfileModule } from '../pofile/profile.module';
import { JwtModule} from '@nestjs/jwt';
import { AuthConstants } from './constants';



@Module({
  imports: [
    DatabaseModule,
    MailModule,
    ProfileModule,
    JwtModule.register({
      secret: AuthConstants.secretKey,
      signOptions: {
          expiresIn: AuthConstants.expiresIn
      }
  }),
    TypeOrmModule.forFeature([UserRepository, EmailVerificationRepository]),
    // MailerModule.forRoot({
    //   transport: {
    //     host: process.env.MAILER_HOST,
    //     port: parseInt(process.env.MAILER_PORT),
    //     auth: {
    //       user: process.env.MAILER_USER,
    //       pass: process.env.MAILER_PASSWORD,
    //     },
    //   },
    //   defaults: {
    //     from: process.env.MAILER_NOREPLY,
    //   },
    //   template: {
    //     dir: `${process.cwd()}/templates`,
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, JwtModule]
})
export class UserModule {}
