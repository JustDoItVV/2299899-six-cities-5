import { CityType, GoodsType } from '../../../types/index.js';
import * as CONSTS from '../offer.const.js';

export const CreateOfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${CONSTS.TitleLength.MIN}`,
    maxLength: `Maximum title length must be ${CONSTS.TitleLength.MAX}`,
  },
  description: {
    minLength: `Minimum description length must be ${CONSTS.DescriptionLength.MIN}`,
    maxLength: `Maximum description length must be ${CONSTS.DescriptionLength.MAX}`,
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  city: {
    invalid: `City must be ${CityType}`,
  },
  preview: {
    minLength: 'Too short for field preview',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    minLength: 'Too short for field images',
  },
  isPremium: {
    invalidFormat: 'Field isPremium must be boolean',
  },
  type: {
    invalid: 'Offer type must be обычный and pro',
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: `Minimum rooms is ${CONSTS.RoomsCount.MIN}`,
    maxValue: `Maximum rooms is ${CONSTS.RoomsCount.MAX}`,
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: `Minimum guests is ${CONSTS.GuestsCount.MIN}`,
    maxValue: `Maximum guests is ${CONSTS.GuestsCount.MAX}`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price is ${CONSTS.Price.MIN}`,
    maxValue: `Maximum price is ${CONSTS.Price.MAX}`,
  },
  goods: {
    invalidFormat: 'Field goods must be an array',
    invalid: `Goods must be ${GoodsType}`,
  },
  authorId: {
    invalidId: 'authorId field must be a valid Mongo id',
  },
  latitude: {
    invalid: 'Latitude field must be a valid coordinate',
  },
  longitude: {
    invalid: 'Longitude field must be a valid coordinate',
  },
} as const;
