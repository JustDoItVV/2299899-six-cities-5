import {
  IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsLatitude, IsLongitude, IsMongoId, Max,
  MaxLength, Min, MinLength
} from 'class-validator';

import { City, CityType, GoodsType, OfferType } from '../../../types/index.js';
import * as CONSTS from '../offer.const.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(CONSTS.TitleLength.MIN, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(CONSTS.TitleLength.MAX, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(CONSTS.DescriptionLength.MIN, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(CONSTS.DescriptionLength.MAX, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.date.invalidFormat })
  public date: Date;

  @IsEnum(CityType, { message: CreateOfferValidationMessage.city.invalid })
  public city: City;

  @MinLength(5, { message: CreateOfferValidationMessage.preview.minLength })
  public preview: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @MinLength(5, { message: CreateOfferValidationMessage.images.minLength })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(OfferType, { message: CreateOfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @Min(CONSTS.RoomsCount.MIN, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(CONSTS.RoomsCount.MAX, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @Min(CONSTS.GuestsCount.MIN, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(CONSTS.GuestsCount.MAX, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(CONSTS.Price.MIN, { message: CreateOfferValidationMessage.price.minValue })
  @Max(CONSTS.Price.MAX, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsEnum(GoodsType, { message: CreateOfferValidationMessage.goods.invalid })
  public goods: GoodsType[];

  @IsMongoId({ message: CreateOfferValidationMessage.authorId.invalidId })
  public authorId: string;

  @IsLatitude({ message: CreateOfferValidationMessage.latitude.invalid })
  public latitude: number;

  @IsLongitude({ message: CreateOfferValidationMessage.longitude.invalid })
  public longitude: number;
}
