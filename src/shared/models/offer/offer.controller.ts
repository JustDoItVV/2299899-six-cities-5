import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';

import { CITIES } from '../../const/cities.js';
import { fillDTO } from '../../helpers/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController, ConfirmAuthorMiddleware, HttpError, HttpMethod, OfferExistsMiddleware,
  PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { CityType, Service } from '../../types/index.js';
import { CommentService } from '../comment/index.js';
import UpdateUserDto from '../user/dto/update-user.dto.js';
import { UserService } from '../user/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { UploadPreviewRdo } from './index.js';
import { OfferService } from './interface/offer-service.interface.js';
import {
  ALLOWED_IMAGE_MIME_TYPES, MAX_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT
} from './offer.const.js';
import { DetailedOfferRdo } from './rdo/detailed-offer.rdo.js';
import { OffersRdo } from './rdo/offers.rdo.js';
import { UploadImagesRdo } from './rdo/upload-images.rdo.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Service.Logger) protected readonly logger: Logger,
    @inject(Service.OfferService) private readonly offerService: OfferService,
    @inject(Service.UserService) private readonly userService: UserService,
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
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
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
      path: '/:offerId/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new ConfirmAuthorMiddleware(this.offerService, 'offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'preview', ALLOWED_IMAGE_MIME_TYPES),
      ],
    });
    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images', ALLOWED_IMAGE_MIME_TYPES),
      ],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
      ],
    });
  }

  public async index({ query, tokenPayload }: Request, res: Response): Promise<void> {
    let limit = query['limit'] ? Number(query['limit']) : MAX_OFFERS_COUNT;

    const params = {};
    const city = query['city'] ? CITIES[query['city'] as CityType] : CITIES.Paris;
    Object.assign(params, { city });
    const premium = query['premium'] ? { isPremium: true } : null;
    Object.assign(params, premium);
    if (premium) {
      limit = limit > MAX_PREMIUM_OFFERS_COUNT ? MAX_PREMIUM_OFFERS_COUNT : limit;
    }

    const userId = tokenPayload ? tokenPayload.id : undefined;

    const offers = await this.offerService.findMany({ params, limit, userId });
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

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload ? tokenPayload.id : undefined;
    const offer = await this.offerService.findOne({ params: {_id: new Types.ObjectId(offerId)}, userId },);
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

  public async uploadPreview({ params, file }: Request<ParamOfferId>, res: Response): Promise<void> {
    if (!file) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No file was uploaded');
    }

    const { offerId } = params;
    const updateDto = { preview: file.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadPreviewRdo, updateDto));
  }

  public async uploadImages({ params, files }: Request<ParamOfferId>, res: Response): Promise<void> {
    this.logger.warn(`${files}`);
    if (!Array.isArray(files)) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No files were uploaded');
    }

    const { offerId } = params;
    const updateDto = { images: files.map((file) => file.filename) };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, updateDto));
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const favoriteOffers = await this.offerService.findMany({ userId: tokenPayload.id, favorites: true });
    this.ok(res, fillDTO(OffersRdo, favoriteOffers));
  }

  public async changeFavoriteStatus({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const offerId = new Types.ObjectId(params['offerId']);
    const userId = new Types.ObjectId(tokenPayload.id);
    const user = await this.userService.findOne({ _id: userId });

    if (user?.favorites.includes(offerId)) {
      user.favorites.splice(user.favorites.indexOf(offerId), 1);
    } else {
      user?.favorites.push(offerId);
    }

    const updateDto = { favorites: user?.favorites };
    const updatedUser = await this.userService.updateById(userId, updateDto);
    this.ok(res, fillDTO(UpdateUserDto, updatedUser));
  }
}
