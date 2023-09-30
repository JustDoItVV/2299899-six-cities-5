import { CITIES } from '../const/cities.js';
import { CityType } from '../types/city-type.enum.js';
import { GoodsType } from '../types/goods-type.enum.js';
import { OfferType } from '../types/offer-type.enum.js';
import { Offer } from '../types/offer.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    date,
    city,
    preview,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    goods,
    author,
    commentsCount,
    latitude,
    longitude,
  ] = offerData.replace('\n', '').split('\t');
  return {
    title,
    description,
    date: new Date(date),
    city: CITIES[city as CityType],
    preview,
    images: images.split(';'),
    isPremium: !!Number(isPremium),
    isFavorite: !!Number(isFavorite),
    rating: Number(rating),
    type: type as OfferType,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    goods: goods.split(';') as GoodsType[],
    author,
    commentsCount: Number(commentsCount),
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}
