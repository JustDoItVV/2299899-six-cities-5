import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { createSHA256 } from '../../helpers/index.js';
import { User, UserType } from '../../types/index.js';
import { OfferEntity } from '../offer/index.js';

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

  @prop({
    required: true,
    ref: 'OfferEntity',
    default: [],
  })
  public favorites: Ref<OfferEntity>[];

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

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
