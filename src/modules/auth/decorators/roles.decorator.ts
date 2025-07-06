import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../entity/users.entity';

export const ROLES_KEY = 'ROLES_KEY';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
