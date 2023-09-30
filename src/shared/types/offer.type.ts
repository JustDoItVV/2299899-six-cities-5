import { City } from './city.type.js';
import { GoodsType } from './goods-type.enum.js';
import { OfferType } from './offer-type.enum.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  goods: GoodsType[];
  author: string;
  commentsCount: number;
  latitude: number;
  longitude: number;
};
