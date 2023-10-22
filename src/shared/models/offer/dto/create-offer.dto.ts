import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude,
  IsMongoId, Max, MaxLength, Min, MinLength
} from 'class-validator';

import { CityType, GoodsType, OfferType } from '../../../types/index.js';
import * as CONSTS from '../offer.const.js';

export class CreateOfferDto {
  @MinLength(CONSTS.TitleLength.MIN)
  @MaxLength(CONSTS.TitleLength.MAX)
  public title: string;

  @MinLength(CONSTS.DescriptionLength.MIN)
  @MaxLength(CONSTS.DescriptionLength.MAX)
  public description: string;

  @IsEnum(CityType)
  public city: CityType;

  @MinLength(5)
  public preview: string;

  @IsArray()
  @ArrayMinSize(CONSTS.IMAGES_ARRAY_LENGTH)
  @ArrayMaxSize(CONSTS.IMAGES_ARRAY_LENGTH)
  @MinLength(5, { each: true })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsEnum(OfferType)
  public type: OfferType;

  @IsInt()
  @Min(CONSTS.RoomsCount.MIN)
  @Max(CONSTS.RoomsCount.MAX)
  public rooms: number;

  @IsInt()
  @Min(CONSTS.GuestsCount.MIN)
  @Max(CONSTS.GuestsCount.MAX)
  public guests: number;

  @IsInt()
  @Min(CONSTS.Price.MIN)
  @Max(CONSTS.Price.MAX)
  public price: number;

  @IsArray()
  @IsEnum(GoodsType, { each: true })
  public goods: GoodsType[];

  @IsMongoId()
  public authorId: string;

  @IsLatitude()
  public latitude: number;

  @IsLongitude()
  public longitude: number;
}
