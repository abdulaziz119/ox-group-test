import { Column, Entity, Unique, Index } from 'typeorm';
import { DB_SCHEMA } from '../utils/env/env';
import { BaseEntity } from './base.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserLanguage {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}

@Entity({ schema: DB_SCHEMA, name: 'users', synchronize: true })
@Unique(['email'])
@Index(['firstName', 'lastName'])
export class UsersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'varchar', default: 'uz' })
  language: UserLanguage;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
