import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthLoginDto, AuthRegisterDto, AuthVerifyDto } from './auth.dto';
import { UsersEntity } from '../../entity/users.entity';
import { OtpEntity } from '../../entity/otp.entity';
import { SingleResponse } from '../../utils/dto/dto';
import { MailService } from '../../utils/middleware/mail.service';
import { AuthorizationService } from '../../utils/middleware/authorization.service';
import { MODELS } from '../../constants/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
    @Inject(MODELS.OTP)
    private readonly otpRepo: Repository<OtpEntity>,
    private readonly authorizationService: AuthorizationService,
    private readonly mailService: MailService,
  ) {}

  async register(
    payload: AuthRegisterDto,
  ): Promise<SingleResponse<{ user: string }>> {
    try {
      const passwordHashPromise = bcrypt.hash(payload.password, 10);
      const UsersModule = new UsersEntity();
      UsersModule.firstName = payload.firstName;
      UsersModule.language = payload.language;
      UsersModule.lastName = payload.lastName;
      UsersModule.gender = payload.gender;
      UsersModule.birthday = payload.birthday;
      UsersModule.email = payload.email;
      UsersModule.password = await passwordHashPromise;

      await this.usersRepo.save(UsersModule);

      const otp = await this.otpRepo.findOne({
        where: { email: payload.email },
      });

      const newOtp = {
        email: payload.email,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        otpSendAt: new Date(),
        retryCount: 1,
      };

      if (!otp) {
        await this.otpRepo.save(newOtp);
      } else {
        newOtp.retryCount += otp.retryCount;
        await this.otpRepo.update({ email: payload.email }, newOtp);
      }
      this.mailService
        .sendOtpEmail(payload.email, newOtp.otp)
        .catch((err: any): void =>
          console.error('Failed to send OTP email:', err),
        );

      return { result: { user: '60 seconds' } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to create a user. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signVerify(
    payload: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      const otp = await this.otpRepo.findOne({
        where: {
          email: payload.email,
        },
      });

      if (
        !otp ||
        otp.otp !== payload.otp ||
        otp.otpSendAt < new Date(Date.now() - 60000)
      ) {
        throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
      }
      otp.retryCount += 1;
      await this.otpRepo.update({ email: payload.email }, otp);
      const user: UsersEntity = await this.usersRepo.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const token: string = await this.authorizationService.sign(
        user.id,
        user.email,
      );

      return { result: { user, token } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to login. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    payload: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    try {
      const user: UsersEntity = await this.usersRepo.findOne({
        where: { email: payload.email },
        select: [
          'id',
          'email',
          'password',
          'firstName',
          'lastName',
          'birthday',
          'gender',
          'language',
        ],
      });

      if (!user || !(await bcrypt.compare(payload.password, user.password))) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token: string = await this.authorizationService.sign(
        user.id,
        user.email,
      );

      return { result: { user, token } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to login. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
