import { inject, injectable } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Service, SortType } from '../../types/index.js';
import { TokenPayload } from '../auth/index.js';
import { MAX_RESPONSE_COMMENTS } from './comment.const.js';
import { CommentEntity } from './comment.entity.ts.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentFindManyQuery } from './interface/comment-find-many-query.interface.js';
import { CommentService } from './interface/comment-service.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(@inject(Service.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>) {}

  public async create(dto: CreateCommentDto, offerId: string, tokenPayload: TokenPayload): Promise<types.DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({ ...dto, offerId, authorId: tokenPayload.id });
    return comment.populate('authorId');
  }

  public async findMany({ params = {}, limit = MAX_RESPONSE_COMMENTS, sortOptions = { field: 'createdAt', order: SortType.DOWN } }: CommentFindManyQuery): Promise<types.DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find(params)
      .limit(limit)
      .populate('authorId')
      .sort({ [sortOptions.field]: sortOptions.order })
      .exec();
  }

  public async deleteByOfferId(id: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({ offerId: id })
      .exec();
    return result.deletedCount;
  }
}
