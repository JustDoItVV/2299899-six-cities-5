import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, GoodsType, Offer, OfferType } from '../../types/index.js';
import * as CONST from './const.js';
import { CITIES } from '../../const/cities.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: [CONST.TitleLength.MIN, `Min length for title is ${CONST.TitleLength.MIN}`],
    maxlength: [CONST.TitleLength.MAX, `Max length for title is ${CONST.TitleLength.MAX}`],
    default: '',
  })
  public title!: string;

  @prop({
    required: true,
    minlength: [CONST.DescriptionLength.MIN, `Min length for description is ${CONST.DescriptionLength.MIN}`],
    maxlength: [CONST.DescriptionLength.MAX, `Max length for description is ${CONST.DescriptionLength.MAX}`],
    default: '',
  })
  public description!: string;

  @prop({
    required: true,
    default: Date.now(),
  })
  public date: Date;

  @prop({
    required: true,
    default: CITIES.Paris,
  })
  public city: City;

  @prop({
    required: true,
    default: '',
  })
  public preview: string;

  @prop({
    required: true,
    default: [],
  })
  public images: string[];

  @prop({
    required: true,
    default: false,
  })
  public isPremium: boolean;

  @prop({
    required: true,
    default: false,
  })
  public isFavorite: boolean;

  @prop({
    required: true,
    min: CONST.Rating.MIN,
    max: CONST.Rating.MAX,
    default: CONST.Rating.MAX,
  })
  public rating: number;

  @prop({
    required: true,
    enum: OfferType,
    default: OfferType.Apartment,
  })
  public type: OfferType;

  @prop({
    required: true,
    min: CONST.RoomsCount.MIN,
    max: CONST.RoomsCount.MAX,
    default: CONST.RoomsCount.MIN,
  })
  public rooms: number;

  @prop({
    required: true,
    min: CONST.GuestsCount.MIN,
    max: CONST.GuestsCount.MAX,
    default: CONST.GuestsCount.MIN,
  })
  public guests: number;

  @prop({
    required: true,
    min: CONST.Price.MIN,
    max: CONST.Price.MAX,
    default: CONST.Price.MIN,
  })
  public price: number;

  @prop({
    required: true,
    type: String,
    enum: GoodsType,
  })
  public goods: GoodsType[];

  @prop({
    required: true,
    ref: UserEntity,
  })
  public authorId: Ref<UserEntity>;

  @prop({
    default: 0,
  })
  public commentsCount: number;

  @prop({
    required: true,
    min: CONST.Latitude.MIN,
    max: CONST.Latitude.MAX,
    default: CONST.Latitude.MIN,
  })
  public latitude: number;

  @prop({
    required: true,
    min: CONST.Longitude.MIN,
    max: CONST.Longitude.MAX,
    default: CONST.Longitude.MIN,
  })
  public longitude: number;

  constructor(offerData: Offer) {
    super();
    this.title = offerData.title;
    this.description = offerData.description;
    this.date = offerData.date;
    this.city = offerData.city;
    this.preview = offerData.preview;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.isFavorite = offerData.isFavorite;
    this.rating = offerData.rating;
    this.type = offerData.type;
    this.rooms = offerData.rooms;
    this.guests = offerData.guests;
    this.price = offerData.price;
    this.goods = offerData.goods;
    this.commentsCount = offerData.commentsCount;
    this.latitude = offerData.latitude;
    this.longitude = offerData.longitude;
  }

}

export const OfferModel = getModelForClass(OfferEntity);
