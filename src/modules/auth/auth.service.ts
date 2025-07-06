import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthLoginDto, AuthVerifyDto, RegisterCompanyDto } from './auth.dto';
import { UsersEntity, UserRole } from '../../entity/users.entity';
import { OtpEntity } from '../../entity/otp.entity';
import { CompanyEntity } from '../../entity/company.entity';
import { SingleResponse } from '../../utils/dto/dto';
import { MailService } from '../../utils/middleware/mail.service';
import { AuthorizationService } from '../../utils/middleware/authorization.service';
import { OxApiService } from '../../utils/services/ox-api.service';
import { MODELS } from '../../constants/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
    @Inject(MODELS.OTP)
    private readonly otpRepo: Repository<OtpEntity>,
    @Inject(MODELS.COMPANY)
    private readonly companyRepo: Repository<CompanyEntity>,
    private readonly authorizationService: AuthorizationService,
    private readonly mailService: MailService,
    private readonly oxApiService: OxApiService,
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
        otp.otpSendAt < new Date(Date.now() - 300000) // 5 minutes expiry
      ) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.UNAUTHORIZED);
      }
      
      const user: UsersEntity = await this.usersRepo.findOne({
        where: {
          email: payload.email,
        },
        relations: ['company'],
      });
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      const token: string = await this.authorizationService.sign(
        user.id,
        user.email,
      );

      // Remove OTP after successful verification
      await this.otpRepo.delete({ email: payload.email });

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
  ): Promise<SingleResponse<{ otp: string }>> {
    try {
      let user = await this.usersRepo.findOne({
        where: { email: payload.email },
      });

      // If user doesn't exist, create a new one with default role 'manager'
      if (!user) {
        const newUser = new UsersEntity();
        newUser.email = payload.email;
        newUser.role = UserRole.MANAGER;
        user = await this.usersRepo.save(newUser);
      }

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const existingOtp = await this.otpRepo.findOne({
        where: { email: payload.email },
      });

      const newOtp = {
        email: payload.email,
        otp: otpCode,
        otpSendAt: new Date(),
        retryCount: 1,
      };

      if (!existingOtp) {
        await this.otpRepo.save(newOtp);
      } else {
        newOtp.retryCount = existingOtp.retryCount + 1;
        await this.otpRepo.update({ email: payload.email }, newOtp);
      }

      // In real app, you would send OTP via email/SMS
      // For testing, we return it in response
      this.mailService
        .sendOtpEmail(payload.email, otpCode)
        .catch((err: any): void =>
          console.error('Failed to send OTP email:', err),
        );

      return { result: { otp: otpCode } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to login. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerCompany(
    payload: RegisterCompanyDto,
    userId: number,
  ): Promise<SingleResponse<{ company: CompanyEntity }>> {
    try {
      // Validate token with OX API
      const profile = await this.oxApiService.validateToken(payload.subdomain, payload.token);

      // Check if company already exists
      let company = await this.companyRepo.findOne({
        where: { subdomain: payload.subdomain },
        relations: ['users'],
      });

      const user = await this.usersRepo.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!company) {
        // Create new company and assign user as admin
        company = new CompanyEntity();
        company.subdomain = payload.subdomain;
        company.token = payload.token;
        company.name = profile.name || payload.subdomain;
        company = await this.companyRepo.save(company);

        // Update user role to admin and assign company
        user.role = UserRole.ADMIN;
        user.company = company;
        user.companyId = company.id.toString();
        await this.usersRepo.save(user);
      } else {
        // Company exists, assign user as manager
        user.role = UserRole.MANAGER;
        user.company = company;
        user.companyId = company.id.toString();
        await this.usersRepo.save(user);
      }

      return { result: { company } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to register company. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCompany(
    companyId: string,
    userId: number,
  ): Promise<SingleResponse<{ message: string }>> {
    try {
      const user = await this.usersRepo.findOne({
        where: { id: userId },
        relations: ['company'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.role !== UserRole.ADMIN) {
        throw new HttpException(
          'Only admin can delete company',
          HttpStatus.FORBIDDEN,
        );
      }

      const company = await this.companyRepo.findOne({
        where: { id: parseInt(companyId) },
        relations: ['users'],
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      // Check if user is admin of this company
      if (user.companyId !== companyId) {
        throw new HttpException(
          'You can only delete your own company',
          HttpStatus.FORBIDDEN,
        );
      }

      // Remove company reference from all users
      await this.usersRepo.update(
        { companyId: companyId },
        { companyId: null, company: null },
      );

      // Delete company
      await this.companyRepo.delete(parseInt(companyId));

      return { result: { message: 'Company deleted successfully' } };
    } catch (error: any) {
      throw new HttpException(
        `Failed to delete company. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProducts(
    userId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<any> {
    try {
      if (size > 20) {
        throw new HttpException('Size cannot be greater than 20', HttpStatus.BAD_REQUEST);
      }

      const user = await this.usersRepo.findOne({
        where: { id: userId },
        relations: ['company'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.role !== UserRole.MANAGER && user.role !== UserRole.ADMIN) {
        throw new HttpException(
          'Only managers can access products',
          HttpStatus.FORBIDDEN,
        );
      }

      if (!user.company) {
        throw new HttpException(
          'User must be assigned to a company',
          HttpStatus.BAD_REQUEST,
        );
      }

      const products = await this.oxApiService.getVariations(
        user.company.subdomain,
        user.company.token,
        page,
        size,
      );

      return { result: products };
    } catch (error: any) {
      throw new HttpException(
        `Failed to get products. ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
