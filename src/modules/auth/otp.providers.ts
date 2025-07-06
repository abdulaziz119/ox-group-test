import { DataSource } from 'typeorm';
import { MODELS, OX_GROUP_TEST_SOURCE } from '../../constants/constants';
import { OtpEntity } from '../../entity/otp.entity';

export const otpProviders = [
  {
    provide: MODELS.OTP,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OtpEntity),
    inject: [OX_GROUP_TEST_SOURCE],
  },
];
