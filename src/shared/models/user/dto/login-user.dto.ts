import { IsEmail, IsString, Length, Matches } from 'class-validator';

import * as CONSTS from '../user.const.js';

export class LoginUserDto {
  @IsString({ message: 'Email is required and must be string' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(CONSTS.EMAIL_PATTERN, { message: 'Email must be valid' })
  public email: string;

  @IsString({ message: 'Password is required' })
  @Length(
    CONSTS.PasswordLength.MIN,
    CONSTS.PasswordLength.MAX,
    { message: `Min length for password is ${CONSTS.PasswordLength.MIN}, max is ${CONSTS.PasswordLength.MAX}` })
  public password: string;
}
