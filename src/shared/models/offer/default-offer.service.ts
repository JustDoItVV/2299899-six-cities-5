import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Service, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { MAX_OFFERS_COUNT } from './offer.const.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

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

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      .populate(['authorId'])
      .exec();
  }

  public async findByIdOrCreate(dto: CreateOfferDto, id: string): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findById(id);
    if (existedOffer) {
      return existedOffer;
    }
    return this.create(dto);
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
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
          },
        },
        { $unset: 'comments' },
        { $limit: MAX_OFFERS_COUNT },
        { $sort: { commentsCount: SortType.DOWN } },
      ]).exec();
  }

  public async findNew(count: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel
      .find()
      .sort({ createdAt: SortType.DOWN })
      .limit(limit)
      .populate(['authorId'])
      .exec();
  }

  public async findDiscussed(count: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel
      .find()
      .sort({ commentCount: SortType.DOWN })
      .limit(limit)
      .populate(['authorId'])
      .exec();
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
