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
    
    // Get user to include role in token
    const user = await this.usersRepo.findOne({
      where: { id, email },
    });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    
    const data = {
      id: id,
      email: email,
      role: user.role,
    };
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
    return token;
  }

  async verify(
    token: string,
    email?: string,
  ): Promise<{ id: number; email: string; role: string }> {
    try {
      if (!token) {
        throw new HttpException(
          'Token is required',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const cleanToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      const decoded = jwt.verify(cleanToken, JWT_SECRET) as {
        id: number;
        email: string;
        role: string;
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

      if (!user) {
        throw new HttpException(
          'User not found or token invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch (error) {
      throw new HttpException(
        error.message || 'Token verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
