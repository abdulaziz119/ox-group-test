import { DataSource } from 'typeorm';
import { MODELS, OX_GROUP_TEST_SOURCE } from '../../constants/constants';
import { CompanyEntity } from '../../entity/company.entity';

export const companyProviders = [
  {
    provide: MODELS.COMPANY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CompanyEntity),
    inject: [OX_GROUP_TEST_SOURCE],
  },
];
