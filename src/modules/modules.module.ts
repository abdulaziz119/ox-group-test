import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ProductsModule],
})
export class ModulesModule {}
