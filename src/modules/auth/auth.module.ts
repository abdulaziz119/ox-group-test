import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { otpProviders } from './otp.providers';
import { DatabaseModule } from '../../database/database.module';
import { JWT_SECRET } from '../../utils/env/env';
import { MailService } from '../../utils/middleware/mail.service';
import { AuthorizationService } from '../../utils/middleware/authorization.service';
import { OxApiService } from '../../utils/services/ox-api.service';
import { usersProviders, UsersService } from '../users';
import { companyProviders } from '../company/company.providers';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    ...usersProviders,
    ...otpProviders,
    ...companyProviders,
    JwtStrategy,
    RolesGuard,
    UsersService,
    AuthService,
    AuthorizationService,
    MailService,
    OxApiService,
  ],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
