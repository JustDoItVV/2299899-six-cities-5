import { DocumentType } from '@typegoose/typegoose';

import { TokenPayload } from '../../auth/index.js';
import { CommentEntity } from '../comment.entity.ts.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { CommentFindManyQuery } from './comment-find-many-query.interface.js';

export interface CommentService {
  create(dto: CreateCommentDto, offerId: string, tokenPayload: TokenPayload): Promise<DocumentType<CommentEntity>>;
  findMany({ params, limit, sortOptions}: CommentFindManyQuery): Promise<DocumentType<CommentEntity>[] | null>;
  deleteByOfferId(id: string): Promise<number | null>;
}
