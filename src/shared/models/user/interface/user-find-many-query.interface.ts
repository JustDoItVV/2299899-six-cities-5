import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { SortType, User } from '../../../types/index.js';

export interface UserFindManyQuery {
  params?: Partial<Base | TimeStamps | User>,
  limit?: number,
  sortOptions?: {
    field: keyof Base | keyof TimeStamps | keyof User,
    order: SortType,
  },
}
