import { CityType } from './city-type.enum.js';

export type City = {
  name: CityType;
  latitude: number;
  longitude: number;
};
