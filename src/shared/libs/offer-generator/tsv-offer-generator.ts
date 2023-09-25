import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/common.js';
import { CITIES } from '../../const/cities.js';
import { OfferType } from '../../types/offer-type.enum.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_LATITUDE = 48;
const MAX_LATITUDE = 54;
const MIN_LONGITUDE = 2;
const MAX_LONGITUDE = 11;
const COORDINATES_FLOAT_DIGITS = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const date = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'days')
      .toISOString();

    const city = getRandomItem<string>(Object.keys(CITIES));
    const preview = getRandomItem<string>(this.mockData.offerImages);
    const offerImages = getRandomItems<string>(this.mockData.offerImages).join(
      ';'
    );
    const isPremium = generateRandomValue(0, 1);
    const isFavorite = generateRandomValue(0, 1);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem<string>(Object.keys(OfferType));

    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods).join(';');

    const user = getRandomItem<string>(this.mockData.users);
    const commentsCount = 0;
    const latitude = generateRandomValue(
      MIN_LATITUDE,
      MAX_LATITUDE,
      COORDINATES_FLOAT_DIGITS
    );
    const longitude = generateRandomValue(
      MIN_LONGITUDE,
      MAX_LONGITUDE,
      COORDINATES_FLOAT_DIGITS
    );

    return [
      title,
      description,
      date,
      city,
      preview,
      offerImages,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      goods,
      user,
      commentsCount,
      latitude,
      longitude,
    ].join('\t');
  }
}
