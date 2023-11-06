import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import { fillDTO } from '../../helpers/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController, ConfirmAuthorMiddleware, HttpMethod, OfferExistsMiddleware,
  PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './interface/offer-service.interface.js';
import { MAX_OFFERS_COUNT } from './offer.const.js';
import { DetailedOfferRdo } from './rdo/datailed-offer.rdo.js';
import { OffersRdo } from './rdo/offers.rdo.js';
import { UploadImagesRdo } from './rdo/upload-image.rdo.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Service.Logger) protected readonly logger: Logger,
    @inject(Service.OfferService) private readonly offerService: OfferService,
    @inject(Service.CommentService) private readonly commentService: CommentService,
    @inject(Service.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new ConfirmAuthorMiddleware(this.offerService, 'offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new ConfirmAuthorMiddleware(this.offerService, 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images'),
      ],
    });
  }

  public async index({ query }: Request, res: Response): Promise<void> {
    const limit = query['limit'] ? Number(query['limit']) : MAX_OFFERS_COUNT;
    const offers = await this.offerService.findMany({ limit });
    const responseData = fillDTO(OffersRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      authorId: tokenPayload.id,
    });
    this.created(res, fillDTO(DetailedOfferRdo, result));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findOne({ _id: new Types.ObjectId(offerId) });
    this.ok(res, fillDTO(DetailedOfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(DetailedOfferRdo, updatedOffer));
  }

  public async uploadImages({ params, file }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { preview: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, updateDto));
  }
}
