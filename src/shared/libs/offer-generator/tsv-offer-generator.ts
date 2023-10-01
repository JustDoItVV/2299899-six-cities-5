import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, OfferType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { CITIES } from '../../const/cities.js';
import * as CONSTS from './const.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const date = dayjs()
      .subtract(generateRandomValue(CONSTS.WeekDay.FIRST, CONSTS.WeekDay.LAST), 'days')
      .toISOString();

    const city = getRandomItem<string>(Object.keys(CITIES));
    const preview = getRandomItem<string>(this.mockData.offerImages);
    const offerImages = getRandomItems<string>(this.mockData.offerImages).join(';');
    const isPremium = generateRandomValue(0, 1);
    const isFavorite = generateRandomValue(0, 1);
    const rating = generateRandomValue(CONSTS.Rating.MIN, CONSTS.Rating.MAX, 1);
    const type = getRandomItem<string>(Object.keys(OfferType));

    const rooms = generateRandomValue(CONSTS.Rooms.MIN, CONSTS.Rooms.MAX);
    const guests = generateRandomValue(CONSTS.Guests.MIN, CONSTS.Guests.MAX);
    const price = generateRandomValue(CONSTS.Price.MIN, CONSTS.Guests.MAX);
    const goods = getRandomItems<string>(this.mockData.goods).join(';');

    const user = getRandomItem<string>(this.mockData.users);
    const commentsCount = 0;
    const latitude = generateRandomValue(
      CONSTS.Latitude.MIN,
      CONSTS.Latitude.MAX,
      CONSTS.COORDINATES_FLOAT_DIGITS
    );
    const longitude = generateRandomValue(
      CONSTS.Longitude.MIN,
      CONSTS.Longitude.MAX,
      CONSTS.COORDINATES_FLOAT_DIGITS
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
