import { Container } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Service } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.ts.js';
import { DefaultCommentService } from './default-comment.service.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Service.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Service.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
