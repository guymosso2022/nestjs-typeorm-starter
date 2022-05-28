import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { EmailVerification } from 'src/modules/user/entities/email-verification.entity';

@Injectable()
export class MailService {
  logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(emailVerification: EmailVerification): Promise<any> {
    try {
      const url = `<a style='text-decoration: none;' href= http://${process.env.APP_HOST}:${process.env.PORT_FRONT}/${process.env.ENDPONT_FONT}/tokens/${emailVerification.emailToken}>cliquez ici</a>`;
      const response = await this.mailerService.sendMail({
        from: `Company <mossoguy@gmail.com>`,
        to: emailVerification.email,
        text: 'Verify Email',
        html: `<h1>Hi User</h1> <br><br> <h2>You have requested to reset your password , please click the following link to change your password</h2>
                <h3>Please click the following link</h3><br>
                    ${url}`,
      });
      return response;
    } catch (e) {
      this.logger.error({
        message: 'Something went wrong',
        errors: e,
      });
      throw new HttpException(e.message, e.status);
    }
  }
}
