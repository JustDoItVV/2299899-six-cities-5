import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import { defaultClasses, DocumentType, types } from '@typegoose/typegoose';

import { Logger } from '../../libs/logger/index.js';
import { Service, SortType, User } from '../../types/index.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { CreateUserDto, DEFAULT_AVATAR_FILENAME } from './index.js';
import { UserFindManyQuery } from './interface/user-find-many-query.interface.js';
import { UserService } from './interface/user-service.interface.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, avatar: DEFAULT_AVATAR_FILENAME });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findOne(params: Partial<defaultClasses.Base<Types.ObjectId> | Pick<User, 'email'>>): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne(params).exec();
  }

  public async findOneOrCreate(params: Partial<defaultClasses.Base | Pick<User, 'email'>>, dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findOne(params);
    if (existedUser) {
      return existedUser;
    }
    return this.create(dto, salt);
  }

  public async findMany({ params = {}, limit = 60, sortOptions = { field: 'name', order: SortType.UP } }: UserFindManyQuery): Promise<DocumentType<UserEntity>[] | null> {
    return this.userModel
      .find(params)
      .limit(limit)
      .sort({ [sortOptions.field]: sortOptions.order })
      .exec();
  }

  public async updateById(id: Types.ObjectId, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
}
