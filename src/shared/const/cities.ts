import { CityType } from '../types/city-type.enum.js';
import { City } from '../types/city.type.js';

export const CITIES: Record<CityType, City> = {
  [CityType.Paris]: {
    name: CityType.Paris,
    latitude: 48.85661,
    longitude: 2.351499,
  },
  [CityType.Cologne]: {
    name: CityType.Cologne,
    latitude: 50.938361,
    longitude: 6.959974,
  },
  [CityType.Brussels]: {
    name: CityType.Brussels,
    latitude: 50.846557,
    longitude: 4.351697,
  },
  [CityType.Amsterdam]: {
    name: CityType.Amsterdam,
    latitude: 52.370216,
    longitude: 4.895168,
  },
  [CityType.Hamburg]: {
    name: CityType.Hamburg,
    latitude: 53.550341,
    longitude: 10.000654,
  },
  [CityType.Dusseldorf]: {
    name: CityType.Dusseldorf,
    latitude: 51.225402,
    longitude: 6.776314,
  },
};
