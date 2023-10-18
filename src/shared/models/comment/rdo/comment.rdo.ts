import { Expose, Type } from 'class-transformer';

import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose({ name: 'createdAt' })
  public postDate: string;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
