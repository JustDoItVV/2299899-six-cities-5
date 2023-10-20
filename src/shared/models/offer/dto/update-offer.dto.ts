import {
  IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsLatitude, IsLongitude, IsMongoId, IsObject,
  Max, MaxLength, Min, MinLength
} from 'class-validator';

import { City, GoodsType, OfferType } from '../../../types/index.js';
import * as CONSTS from '../offer.const.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDto {
  @MinLength(CONSTS.TitleLength.MIN, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(CONSTS.TitleLength.MAX, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @MinLength(CONSTS.DescriptionLength.MIN, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(CONSTS.DescriptionLength.MAX, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsDateString({}, { message: UpdateOfferValidationMessage.date.invalidFormat })
  public date?: Date;

  @IsObject({ message: UpdateOfferValidationMessage.city.invalid })
  public city?: City;

  @MinLength(5, { message: UpdateOfferValidationMessage.preview.minLength })
  public preview?: string;

  @IsArray({ message: UpdateOfferValidationMessage.images.invalidFormat })
  @MinLength(5, { message: UpdateOfferValidationMessage.images.minLength })
  public images?: string[];

  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsEnum(OfferType, { message: UpdateOfferValidationMessage.type.invalid })
  public type?: OfferType;

  @IsInt({ message: UpdateOfferValidationMessage.rooms.invalidFormat })
  @Min(CONSTS.RoomsCount.MIN, { message: UpdateOfferValidationMessage.rooms.minValue })
  @Max(CONSTS.RoomsCount.MAX, { message: UpdateOfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsInt({ message: UpdateOfferValidationMessage.guests.invalidFormat })
  @Min(CONSTS.GuestsCount.MIN, { message: UpdateOfferValidationMessage.guests.minValue })
  @Max(CONSTS.GuestsCount.MAX, { message: UpdateOfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(CONSTS.Price.MIN, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(CONSTS.Price.MAX, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsArray({ message: UpdateOfferValidationMessage.goods.invalidFormat })
  @IsEnum(GoodsType, { message: UpdateOfferValidationMessage.goods.invalid })
  public goods?: GoodsType[];

  @IsMongoId({ message: UpdateOfferValidationMessage.authorId.invalidId })
  public authorId?: string;

  @IsLatitude({ message: UpdateOfferValidationMessage.latitude.invalid })
  public latitude?: number;

  @IsLongitude({ message: UpdateOfferValidationMessage.longitude.invalid })
  public longitude?: number;
}
