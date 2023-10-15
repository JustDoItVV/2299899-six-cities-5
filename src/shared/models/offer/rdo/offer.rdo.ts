import { Expose } from 'class-transformer';
import { City, GoodsType, OfferType, User } from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
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
  public rooms!: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: GoodsType[];

  @Expose()
  public authorId: User;

  @Expose()
  public commentsCount: number;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}
