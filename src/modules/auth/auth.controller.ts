import { Body, Controller, HttpCode, Post, Delete, Param, Get, Query } from '@nestjs/common';
import { AuthLoginDto, AuthVerifyDto, RegisterCompanyDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SingleResponse } from '../../utils/dto/dto';
import { ErrorResourceDto } from '../../utils/dto/error.dto';
import { UsersEntity } from '../../entity/users.entity';
import { CompanyEntity } from '../../entity/company.entity';
import { Auth } from './decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { AdminOnly } from './decorators/admin-only.decorator';
import { ManagerOnly } from './decorators/manager-only.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/verify')
  @HttpCode(200)
  async verify(
    @Body() body: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return this.authService.signVerify(body);
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() body: AuthLoginDto,
  ): Promise<SingleResponse<{ otp: string }>> {
    return await this.authService.login(body);
  }

  @Post('/register-company')
  @HttpCode(201)
  @Auth()
  @ApiBearerAuth()
  async registerCompany(
    @Body() body: RegisterCompanyDto,
    @User() user: any,
  ): Promise<SingleResponse<{ company: CompanyEntity }>> {
    return await this.authService.registerCompany(body, user.id);
  }

  @Delete('/company/:id')
  @HttpCode(200)
  @AdminOnly()
  @ApiBearerAuth()
  async deleteCompany(
    @Param('id') companyId: string,
    @User() user: any,
  ): Promise<SingleResponse<{ message: string }>> {
    return await this.authService.deleteCompany(companyId, user.id);
  }
}
