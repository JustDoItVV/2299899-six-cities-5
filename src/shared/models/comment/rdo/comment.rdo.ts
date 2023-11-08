import { Expose, Type } from 'class-transformer';
import { Max, Min } from 'class-validator';

import { UserRdo } from '../../user/index.js';
import * as CONSTS from '../comment.const.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  @Min(CONSTS.Rating.MIN)
  @Max(CONSTS.Rating.MAX)
  public rating: number;

  @Expose({ name: 'createdAt' })
  public postDate: string;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
