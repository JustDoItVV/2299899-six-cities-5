import { inject, injectable } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Service } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.ts.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(@inject(Service.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>) {}

  public async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('authorId');
  }

  public async findByOfferId(id: string): Promise<types.DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId: id })
      .populate('authorId');
  }

  public async deleteByOfferId(id: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({ offerId: id })
      .exec();
    return result.deletedCount;
  }
}
