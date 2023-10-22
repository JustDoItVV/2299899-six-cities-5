import { Container } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserService } from './interface/user-service.interface.js';
import { UserController } from './user.controller.js';
import { UserEntity, UserModel } from './user.entity.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Service.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Service.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Service.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
