import { Container } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import CommentController from './comment.controller.js';
import { CommentEntity, CommentModel } from './comment.entity.ts.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentService } from './interface/comment-service.interface.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Service.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Service.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<Controller>(Service.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
