import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entity/users.entity';
import { JWT_SECRET } from '../env/env';
import { MODELS } from '../../constants/constants';

dotenv.config();

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(MODELS.USERS)
    private readonly usersRepo: Repository<UsersEntity>,
  ) {}

  async sign(id: number, email: string): Promise<string> {
    if (!id || !email) {
      throw new HttpException(
        'User ID and email are required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const data = {
      id: id,
      role: email,
    };
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
    return token;
  }

  async verify(
    token: string,
    email: string,
  ): Promise<{ id: number; email: string }> {
    try {
      if (!token || !email) {
        throw new HttpException(
          'Token is required or email is required',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const cleanToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      const decoded = jwt.verify(cleanToken, JWT_SECRET) as {
        id: number;
        email: string;
        iat?: number;
        exp?: number;
      };
      if (!decoded) {
        throw new HttpException(
          'Token verification failed',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.usersRepo.findOne({
        where: {
          id: decoded.id,
          email: decoded.email,
        },
      });

      if (!user || decoded.email !== email) {
        throw new HttpException(
          'User not found or email mismatch',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return decoded;
    } catch (error) {
      throw new HttpException(
        error.message || 'Token verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
