import { Column, Entity, OneToMany } from 'typeorm';
import { DB_SCHEMA } from '../utils/env/env';
import { BaseEntity } from './base.entity';
import { UsersEntity } from './users.entity';

@Entity({ schema: DB_SCHEMA, name: 'companies', synchronize: true })
export class CompanyEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  subdomain: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @OneToMany(() => UsersEntity, (user) => user.company)
  users: UsersEntity[];
}
