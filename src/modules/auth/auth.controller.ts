import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto, AuthVerifyDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleResponse } from '../../utils/dto/dto';
import { ErrorResourceDto } from '../../utils/dto/error.dto';
import { UsersEntity } from '../../entity/users.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() body: AuthRegisterDto,
  ): Promise<SingleResponse<{ user: string }>> {
    return await this.authService.register(body);
  }

  @Post('/sign-verify')
  @HttpCode(200)
  async signVerify(
    @Body() body: AuthVerifyDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return this.authService.signVerify(body);
  }

  @ApiResponse({ type: ErrorResourceDto, status: 401 })
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() body: AuthLoginDto,
  ): Promise<SingleResponse<{ user: UsersEntity; token: string }>> {
    return await this.authService.login(body);
  }
}
