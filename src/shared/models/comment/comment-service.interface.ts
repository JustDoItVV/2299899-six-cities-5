import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.ts.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(id: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(id: string): Promise<number | null>;
}
