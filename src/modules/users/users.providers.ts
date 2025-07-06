import { DataSource } from 'typeorm';
import { MODELS, OX_GROUP_TEST_SOURCE } from '../../constants/constants';
import { UsersEntity } from '../../entity/users.entity';

export const usersProviders = [
  {
    provide: MODELS.USERS,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UsersEntity),
    inject: [OX_GROUP_TEST_SOURCE],
  },
];
