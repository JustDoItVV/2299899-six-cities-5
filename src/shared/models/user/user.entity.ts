import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

import { createSHA256 } from '../../helpers/index.js';
import { User, UserType } from '../../types/index.js';

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
  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true, unique: true, default: '' })
  public email: string;

  @prop({ default: '' })
  public avatar: string;

  @prop({ required: true, default: UserType.Common })
  public type: UserType;

  @prop({ required: true, default: '' })
  public password: string;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
    this.password = userData.password;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
