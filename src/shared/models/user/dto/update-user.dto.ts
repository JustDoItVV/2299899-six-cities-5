import { IsArray, IsEmail, IsString, Length, Matches } from 'class-validator';

import { Ref } from '@typegoose/typegoose/lib/types.js';

import { OfferEntity } from '../../offer/index.js';
import * as CONSTS from '../user.const.js';

export default class UpdateUserDto {
  @IsString({ message: 'Name is required and must be string' })
  @Length(
    CONSTS.NameLength.MIN,
    CONSTS.NameLength.MAX,
    { message: `Min name length is ${CONSTS.NameLength.MIN}, max is ${CONSTS.NameLength.MAX}` })
  public name?: string;

  @IsString({ message: 'Email is required and must be string' })
  @IsEmail({}, { message: 'Email must be valid' })
  @Matches(CONSTS.EMAIL_PATTERN, { message: 'Email must be valid' })
  public email?: string;

  @IsString({ message: 'Password is required' })
  @Length(
    CONSTS.PasswordLength.MIN,
    CONSTS.PasswordLength.MAX,
    { message: `Min length for password is ${CONSTS.PasswordLength.MIN}, max is ${CONSTS.PasswordLength.MAX}` })
  public avatar?: string;

  @IsArray()
  public favorites?: Ref<OfferEntity>[];
}
