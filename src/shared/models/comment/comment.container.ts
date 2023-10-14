import { Container } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Service } from '../../types/index.js';
import { DefaultCommentService } from './default-comment.service.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel } from './comment.entity.ts.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Service.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Service.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
