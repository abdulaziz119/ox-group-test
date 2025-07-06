import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../entity/users.entity';
import { OtpEntity } from '../entity/otp.entity';
import { OX_GROUP_TEST_SOURCE } from '../constants/constants';
import {
  DB_DB,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
} from '../utils/env/env';

export const databaseProviders = [
  {
    provide: OX_GROUP_TEST_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASS,
        database: DB_DB,
        synchronize: true,
        logging: false,
        schema: DB_SCHEMA,
        entities: [UsersEntity, OtpEntity],
        // extra: {
        //   timezone: 'UTC',
        // },
      });
      await dataSource.initialize();
      return dataSource;
    },
  },
];
