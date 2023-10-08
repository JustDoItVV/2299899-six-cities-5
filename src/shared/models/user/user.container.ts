import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Service } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Service.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Service.UserModel).toConstantValue(UserModel);

  return userContainer;
}
