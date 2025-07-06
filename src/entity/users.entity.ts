import { Column, Entity, Unique, Index, ManyToOne, JoinColumn } from 'typeorm';
import { DB_SCHEMA } from '../utils/env/env';
import { BaseEntity } from './base.entity';
import { CompanyEntity } from './company.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserLanguage {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity({ schema: DB_SCHEMA, name: 'users', synchronize: true })
@Unique(['email'])
@Index(['firstName', 'lastName'])
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'varchar', default: 'uz' })
  language: UserLanguage;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MANAGER })
  role: UserRole;

  @ManyToOne(() => CompanyEntity, (company) => company.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'companyId' })
  company?: CompanyEntity;

  @Column({ type: 'uuid', nullable: true })
  companyId?: string;
}
