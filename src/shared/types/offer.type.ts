import { City } from './city.type.js';
import { GoodsType } from './goods-type.enum.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  goods: GoodsType[];
  author: User;
  commentsCount: number;
  latitude: number;
  longitude: number;
};
