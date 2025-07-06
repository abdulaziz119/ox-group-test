import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ManagerOnly } from '../auth/decorators/manager-only.decorator';
import { User } from '../auth/decorators/user.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(200)
  @ManagerOnly()
  @ApiBearerAuth()
  async getProducts(
    @User() user: any,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<any> {
    return await this.authService.getProducts(user.id, page, size);
  }
}
