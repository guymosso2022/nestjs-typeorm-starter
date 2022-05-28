import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../modules/**/entities/*.entity.{js,ts}'],
  migrations: process.env.NODE_ENV === 'development' ? ['migrations/*.ts'] : ['dist/migrations/*.js'],
  // [__dirname + '/../../src/migrations/*{.js,.ts}']
  migrationsTableName: 'migration',
  logging: true,
  logger: 'file',
  cli: {
    entitiesDir: 'src/modules/**/entities',
    migrationsDir: 'migrations' || 'dist/migrations',
  },
  synchronize: false,
};
export default databaseConfig;
