import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';

import { UserType } from '../../../types/index.js';
import * as CONSTS from '../user.const.js';

export class CreateUserDto {
  @IsString({ message: 'Name is required and must be string' })
  @Length(
    CONSTS.NameLength.MIN,
    CONSTS.NameLength.MAX,
    { message: `Min name length is ${CONSTS.NameLength.MIN}, max is ${CONSTS.NameLength.MAX}` })
  public name: string;

  @IsString({ message: 'Email is required and must be string' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(CONSTS.EMAIL_PATTERN, { message: 'Email must be valid' })
  public email: string;

  @IsEnum(UserType, { message: `User type must be ${UserType}` })
  public type: UserType;

  @IsString({ message: 'Password is required' })
  @Length(
    CONSTS.PasswordLength.MIN,
    CONSTS.PasswordLength.MAX,
    { message: `Min length for password is ${CONSTS.PasswordLength.MIN}, max is ${CONSTS.PasswordLength.MAX}` })
  public password: string;
}
