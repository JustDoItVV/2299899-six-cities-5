import { inject, injectable } from 'inversify';

import { DocumentType, types } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { CITIES } from '../../const/cities.js';
import { Logger } from '../../libs/logger/index.js';
import { Service, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferFindOneQuery } from './index.js';
import { OfferFindManyQuery } from './interface/offer-find-many-query.interface.js';
import { OfferService } from './interface/offer-service.interface.js';
import {
  authorPipeline, commentsPipeline, getUserPipeline, mainOffersPipeline
} from './offer.aggregation.js';
import { MAX_OFFERS_COUNT } from './offer.const.js';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const modifiedDto = { ...dto, city: CITIES[dto.city] };
    const result = await (await this.offerModel.create(modifiedDto)).populate(['authorId']);
    this.logger.info(`New offer created: id - ${result.id}, title - ${result.title}, authorId - ${result.authorId}`);
    return result;
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate(['authorId'])
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(id)
      .exec();
  }

  public async findOne({ params, userId }: OfferFindOneQuery): Promise<DocumentType<OfferEntity> | null> {
    return this.findMany({ params, limit: 1, userId }).then((array) => array ? array[0] : null);
  }

  public async findOneOrCreate(params: Partial<Base | TimeStamps>, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findOne({ params });
    if (existedOffer) {
      return existedOffer;
    }
    return this.create(dto);
  }

  public async findMany({
    params = {},
    userId,
    limit = MAX_OFFERS_COUNT,
    favorites = false,
    sortOptions = {
      field: 'createdAt',
      order: SortType.DOWN,
    }
  }: OfferFindManyQuery): Promise<DocumentType<OfferEntity>[] | null> {
    const userPipeline = userId ? getUserPipeline(userId) : [];
    const favoritesPipeline = favorites ? [{ $match: { $expr: { $in: ['$_id', '$user.favorites'] } } }] : [];
    const limitPipeline = userId ? [] : [{ $limit: limit }];
    return this.offerModel
      .aggregate([
        { $match: params },
        ...commentsPipeline,
        ...userPipeline,
        ...authorPipeline,
        ...mainOffersPipeline,
        ...favoritesPipeline,
        { $unset: 'comments' },
        ...limitPipeline,
        { $sort: { [sortOptions.field]: sortOptions.order } },
      ])
      .exec();
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: id })) !== null;
  }
}
