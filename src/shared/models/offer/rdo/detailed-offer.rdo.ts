import { Expose, Type } from 'class-transformer';

import { City, GoodsType, OfferType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class DetailedOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose({ name: 'updatedAt' })
  public date: Date;

  @Expose()
  public city: City;

  @Expose()
  public preview: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: GoodsType[];

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}
