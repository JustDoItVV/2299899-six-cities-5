import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import { defaultClasses, DocumentType, types } from '@typegoose/typegoose';

import { CITIES } from '../../const/cities.js';
import { Logger } from '../../libs/logger/index.js';
import { Service, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferFindManyQuery } from './interface/offer-find-many-query.interface.js';
import { OfferService } from './offer-service.interface.js';
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

  public async findOne(params: Partial<defaultClasses.Base<Types.ObjectId>>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findOne(params)
      .populate(['authorId'])
      .exec();
  }

  public async findOneOrCreate(params: Partial<defaultClasses.Base<Types.ObjectId>>, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findOne(params);
    if (existedOffer) {
      return existedOffer;
    }
    return this.create(dto);
  }

  public async findMany({
    limit = MAX_OFFERS_COUNT,
    sortOptions = {
      field: 'createdAt',
      order: SortType.DOWN,
    }
  }: OfferFindManyQuery): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $in: ['$$offerId', '$offers'] } } },
              { $project: { _id: 1 } },
            ],
            as: 'comments',
          }
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
                    in: {
                      $add: ['$$value', '$$this.rating'],
                    },
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
      ]).exec();
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: id })) !== null;
  }

  public async incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, {
        '$inc': { commentsCount: 1 }
      }).exec();
  }
}
