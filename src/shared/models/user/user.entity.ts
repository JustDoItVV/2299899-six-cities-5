import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { AVATAR_PATTERN, EMAIL_PATTERN, NameLength, PasswordLength } from './const.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: [NameLength.MIN, `Min length for name is ${NameLength.MIN}`],
    maxlength: [NameLength.MAX, `Max length for name is ${NameLength.MAX}`],
    default: '',
  })
  public name: string;

  @prop({
    required: true,
    unique: true,
    match: [EMAIL_PATTERN, 'Email is incorrect'],
    default: '',
  })
  public email: string;

  @prop({
    match: [AVATAR_PATTERN, 'Avatar image name is incorrect'],
    default: '',
  })
  public avatar: string;

  @prop({
    required: true,
    default: UserType.Common,
  })
  public type: UserType;

  @prop({
    required: true,
    minlength: [PasswordLength.MIN, `Min length for password is ${PasswordLength.MIN}`],
    maxlength: [PasswordLength.MAX, `Max length for password is ${PasswordLength.MAX}`],
    default: '',
  })
  private password: string;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
