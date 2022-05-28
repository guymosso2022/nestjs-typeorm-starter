import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const PORT = process.env.APP_PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(compression());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT);
  if (process.env.NODE_ENV !== 'production') {
    logger.log(
      `You start the project in environment: ${process.env.NODE_ENV?.toLocaleUpperCase()}`,
    );
    logger.log(`Project is running at: http://${process.env.APP_HOST}:${PORT}`);
  }
}
bootstrap();
