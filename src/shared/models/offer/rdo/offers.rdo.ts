import { Expose } from 'class-transformer';

import { City, OfferType } from '../../../types/index.js';

export class OffersRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose({ name: 'updatedAt' })
  public date: Date;

  @Expose()
  public city: City;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount: number;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}
