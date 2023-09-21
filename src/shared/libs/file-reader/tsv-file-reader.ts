import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import { CITIES } from '../../const/cities.js';
import { OfferType } from '../../types/offer-type.enum.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    try {
      this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
    } catch (error: unknown) {
      console.error(`Failed to read file ${this.filename}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not found');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
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
        ]) => ({
          title,
          description,
          date: new Date(date),
          city: CITIES[city],
          preview,
          images: images.split(';'),
          isPremium: !!Number(isPremium),
          isFavorite: !!Number(isFavorite),
          rating: Number(rating),
          type: OfferType[type as 'Apartment' | 'House' | 'Room' | 'Hotel'],
          rooms: Number(rooms),
          guests: Number(guests),
          price: Number(price),
          goods: goods.split(';'),
          author,
          commentsCount: Number(commentsCount),
          latitude: Number(latitude),
          longitude: Number(longitude),
        })
      );
  }
}
