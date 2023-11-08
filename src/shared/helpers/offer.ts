import { CITIES } from '../const/cities.js';
import { CityType, GoodsType, Offer, OfferType, UserType } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    city,
    preview,
    images,
    isPremium,
    type,
    rooms,
    guests,
    price,
    goods,
    name,
    email,
    avatar,
    userType,
    password,
    latitude,
    longitude,
  ] = offerData.replace('\n', '').split('\t');
  return {
    title,
    description,
    city: CITIES[city as CityType],
    preview,
    images: images.split(';'),
    isPremium: !!Number(isPremium),
    type: type as OfferType,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    goods: goods.split(';').map((key) => key as GoodsType),
    author: {
      name,
      email,
      avatar,
      type: UserType[userType as keyof typeof UserType],
      password,
    },
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}
