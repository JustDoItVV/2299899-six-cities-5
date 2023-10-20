import { IsEnum, IsString, Length } from 'class-validator';

import { UserType } from '../../../types/index.js';
import * as CONSTS from '../user.const.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(CONSTS.NameLength.MIN, CONSTS.NameLength.MAX, { message: CreateUserMessages.name.lengthField })
  public name: string;

  @IsString({ message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar: string;

  @IsEnum(UserType, { message: CreateUserMessages.type.invalidFormat })
  public type: UserType;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(CONSTS.PasswordLength.MIN, CONSTS.PasswordLength.MAX, { message: CreateUserMessages.password.lengthField })
  public password: string;
}
