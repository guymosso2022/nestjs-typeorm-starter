import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { EmailVerification } from '../entities/email-verification.entity';

@EntityRepository(EmailVerification)
export class EmailVerificationRepository extends Repository<EmailVerification> {
  logger = new Logger(EmailVerificationRepository.name);

  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
  ) {
    super();
  }

  async getEmailVerificationByEMail(email: string){
    return await this.emailVerificationRepository.findOne(email);
  }

  async findEmailVerifcationByToken(email: any){
    const emailVerification =  await this.emailVerificationRepository.findOne(email);
    console.log("emailVerification",emailVerification)
    return emailVerification;
  }
}
