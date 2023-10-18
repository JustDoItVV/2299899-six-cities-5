import {
  defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity
} from '@typegoose/typegoose';

import { CITIES } from '../../const/cities.js';
import { City, GoodsType, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import * as CONST from './offer.const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, default: '' })
  public title!: string;

  @prop({ required: true, default: '' })
  public description!: string;

  @prop({ required: true, default: Date.now() })
  public date!: Date;

  @prop({ required: true, default: CITIES.Paris })
  public city!: City;

  @prop({ required: true, default: '' })
  public preview!: string;

  @prop({ required: true, default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, default: CONST.Rating.MAX })
  public rating!: number;

  @prop({ required: true, enum: OfferType, default: OfferType.Apartment })
  public type!: OfferType;

  @prop({ required: true, default: CONST.RoomsCount.MIN })
  public rooms!: number;

  @prop({ required: true, default: CONST.GuestsCount.MIN })
  public guests!: number;

  @prop({ required: true, default: CONST.Price.MIN })
  public price!: number;

  @prop({ required: true, type: () => String, enum: GoodsType })
  public goods!: GoodsType[];

  @prop({ required: true, ref: UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ required: true, default: CONST.Latitude.MIN })
  public latitude!: number;

  @prop({ required: true, default: CONST.Longitude.MIN })
  public longitude!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
