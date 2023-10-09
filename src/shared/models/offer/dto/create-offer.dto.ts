import { City, GoodsType, OfferType } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public date: Date;
  public city: City;
  public preview: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: OfferType;
  public rooms: number;
  public guests: number;
  public price: number;
  public goods: GoodsType[];
  public authorId: string;
  public latitude: number;
  public longitude: number;
}
