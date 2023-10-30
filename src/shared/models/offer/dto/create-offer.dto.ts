import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude, Max,
  MaxLength, Min, MinLength
} from 'class-validator';

import { CityType, GoodsType, OfferType } from '../../../types/index.js';
import * as CONSTS from '../offer.const.js';

export class CreateOfferDto {
  @MinLength(CONSTS.TitleLength.MIN, { message: `Min title length is ${CONSTS.TitleLength.MIN}` })
  @MaxLength(CONSTS.TitleLength.MAX, { message: `Max title length is ${CONSTS.TitleLength.MAX}` })
  public title: string;

  @MinLength(CONSTS.DescriptionLength.MIN, { message: `Min description length is ${CONSTS.DescriptionLength.MIN}` })
  @MaxLength(CONSTS.DescriptionLength.MAX, { message: `Max description length is ${CONSTS.DescriptionLength.MAX}` })
  public description: string;

  @IsEnum(CityType, { message: `City must be ${CityType}` })
  public city: CityType;

  @MinLength(CONSTS.MIN_IMAGE_FILENAME_LENGTH, { message: `Min filename length with extension is ${CONSTS.MIN_IMAGE_FILENAME_LENGTH}` })
  public preview: string;

  @IsArray({ message: 'Images must be array' })
  @ArrayMinSize(CONSTS.IMAGES_ARRAY_LENGTH, { message: `Number of images must be exactly ${CONSTS.IMAGES_ARRAY_LENGTH}` })
  @ArrayMaxSize(CONSTS.IMAGES_ARRAY_LENGTH, { message: `Number of images must be exactly ${CONSTS.IMAGES_ARRAY_LENGTH}` })
  @MinLength(CONSTS.MIN_IMAGE_FILENAME_LENGTH, { each: true, message: `Min filename length with extension is ${CONSTS.MIN_IMAGE_FILENAME_LENGTH}` })
  public images: string[];

  @IsBoolean({ message: 'isPremium must be boolean' })
  public isPremium: boolean;

  @IsEnum(OfferType, { message: `Offer type must be ${OfferType}` })
  public type: OfferType;

  @IsInt({ message: 'Rooms is required and must be an integer' })
  @Min(CONSTS.RoomsCount.MIN, { message: `Rooms min value is ${CONSTS.RoomsCount.MIN}` })
  @Max(CONSTS.RoomsCount.MAX, { message: `Rooms max value is ${CONSTS.RoomsCount.MAX}` })
  public rooms: number;

  @IsInt({ message: 'Guests is required and must be an integer' })
  @Min(CONSTS.GuestsCount.MIN, { message: `Guests min value is ${CONSTS.GuestsCount.MIN}` })
  @Max(CONSTS.GuestsCount.MAX, { message: `Guests max value is ${CONSTS.GuestsCount.MAX}` })
  public guests: number;

  @IsInt({ message: 'Price is required and must be an integer' })
  @Min(CONSTS.Price.MIN, { message: `Price min value is ${CONSTS.Price.MIN}` })
  @Max(CONSTS.Price.MAX, { message: `Price max value is ${CONSTS.Price.MAX}` })
  public price: number;

  @IsArray({ message: 'Goods must be array' })
  @IsEnum(GoodsType, { each: true, message: `Goods must be ${GoodsType}` })
  public goods: GoodsType[];

  public authorId: string;

  @IsLatitude({ message: 'Latitude field must be a valid coordinate' })
  public latitude: number;

  @IsLongitude({ message: 'Longitude field must be a valid coordinate' })
  public longitude: number;
}
