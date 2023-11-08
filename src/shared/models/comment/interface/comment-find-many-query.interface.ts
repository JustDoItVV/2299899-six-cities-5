import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { Comment, SortType } from '../../../types/index.js';

export interface CommentFindManyQuery {
  params?: Partial<Base | TimeStamps | Comment>,
  limit?: number,
  sortOptions?: {
    field: keyof Base | keyof TimeStamps | keyof Comment,
    order: SortType,
  },
}
