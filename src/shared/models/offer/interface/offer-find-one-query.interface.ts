import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

export interface OfferFindOneQuery {
  params?: Partial<Base | TimeStamps>,
  userId?: string,
}
