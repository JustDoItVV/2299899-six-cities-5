import { inject, injectable } from 'inversify';

import { DocumentType, types } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { CITIES } from '../../const/cities.js';
import { Logger } from '../../libs/logger/index.js';
import { Service, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferFindManyQuery } from './interface/offer-find-many-query.interface.js';
import { OfferService } from './interface/offer-service.interface.js';
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

  public async findOne(params: Partial<Base | TimeStamps>): Promise<DocumentType<OfferEntity> | null> {
    return this.findMany({ params, limit: 1 }).then((array) => array ? array[0] : null);
  }

  public async findOneOrCreate(params: Partial<Base | TimeStamps>, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findOne(params);
    if (existedOffer) {
      return existedOffer;
    }
    return this.create(dto);
  }

  public async findMany({
    params = {},
    limit = MAX_OFFERS_COUNT,
    sortOptions = {
      field: 'createdAt',
      order: SortType.DOWN,
    }
  }: OfferFindManyQuery): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel
      .aggregate([
        { $match: params },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'authorId',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
            rating: {
              $divide: [
                {
                  $reduce: {
                    input: '$comments',
                    initialValue: 0,
                    in: { $add: ['$$value', '$$this.rating'] },
                  },
                },
                {
                  $cond: [{ $ne: [{ $size: '$comments' }, 0] }, { $size: '$comments' }, 1],
                },
              ],
            },
          },
        },
        { $unset: 'comments' },
        { $limit: limit },
        { $sort: { [sortOptions.field]: sortOptions.order } },
      ])
      .exec();
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: id })) !== null;
  }
}
