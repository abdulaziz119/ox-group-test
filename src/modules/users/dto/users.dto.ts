import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserLanguage } from '../../../entity/users.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({ example: 'uz' })
  @IsString()
  @IsOptional()
  @IsEnum(UserLanguage, { message: 'Language must be either uz, ru or en' })
  language?: UserLanguage = UserLanguage.UZ;

  @ApiProperty({ example: 'male' })
  @IsEnum(Gender, { message: 'Gender must be either male or female' })
  gender: Gender;

  @ApiProperty({ example: '2004-09-09T07:32:34.277Z' })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ example: '2004-09-09T07:32:34.277Z' })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ example: 'uz' })
  @IsEnum(UserLanguage)
  @IsOptional()
  language?: UserLanguage;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}

export class AuthOtpDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
