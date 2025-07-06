import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../../../entity/users.entity';

export function ManagerOnly() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(UserRole.MANAGER, UserRole.ADMIN), // Admin ham manager vazifalarini bajara oladi
  );
}
