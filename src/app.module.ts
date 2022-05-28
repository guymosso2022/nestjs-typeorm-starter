import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/pofile/profile.module';
import { UserModule } from './modules/user/user.module';
import databaseConfig from './shared/database/database.config';
import { DatabaseModule } from './shared/database/database.module';
import { MailModule } from './shared/mail/mail.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MailModule,
    ProfileModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig as TypeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
