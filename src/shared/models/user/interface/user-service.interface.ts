import { Types } from 'mongoose';

import { defaultClasses, DocumentType } from '@typegoose/typegoose';

import { User } from '../../../types/index.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import UpdateUserDto from '../dto/update-user.dto.js';
import { UserEntity } from '../user.entity.js';
import { UserFindManyQuery } from './user-find-many-query.interface.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findOne(params: Partial<defaultClasses.Base | Pick<User, 'email'>>): Promise<DocumentType<UserEntity> | null>;
  findOneOrCreate(params: Partial<defaultClasses.Base | Pick<User, 'email'>>, dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findMany({ params, limit, sortOptions }: UserFindManyQuery): Promise<DocumentType<UserEntity>[] | null>;
  updateById(id: Types.ObjectId, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
