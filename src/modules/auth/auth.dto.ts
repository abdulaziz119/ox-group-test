import {
  Length,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserLanguage } from '../../entity/users.entity';

export class AuthRegisterDto {
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
  language: UserLanguage;

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

export class AuthLoginDto {
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

export class AuthVerifyDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
