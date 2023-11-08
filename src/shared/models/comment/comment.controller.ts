import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

import { fillDTO } from '../../helpers/index.js';
import {
  BaseController, HttpError, HttpMethod, OfferExistsMiddleware, PrivateRouteMiddleware,
  ValidateDtoMiddleware, ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { ParamOfferId } from '../offer/index.js';
import { OfferService } from '../offer/interface/offer-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentService } from './interface/comment-service.interface.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { CreateCommentRequest } from './type/create-comment-request.type.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Service.Logger) protected readonly logger: Logger,
    @inject(Service.CommentService) private readonly commentService: CommentService,
    @inject(Service.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Registering routes for CommentController...');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId', method:
      HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new OfferExistsMiddleware(this.offerService, 'offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findMany({ params });
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);

  }

  public async create(
    { params, body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const offerId = params['offerId'] as string;

    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body, offerId, tokenPayload);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
