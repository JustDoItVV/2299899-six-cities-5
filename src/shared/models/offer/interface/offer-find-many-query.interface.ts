import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { Offer, SortType } from '../../../types/index.js';

export interface OfferFindManyQuery {
  params?: Partial<Base | TimeStamps | Offer>,
  limit?: number,
  sortOptions?: {
    field: keyof Base | keyof TimeStamps | keyof Offer,
    order: SortType,
  },
}
