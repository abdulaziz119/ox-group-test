import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class ModulesModule {}
