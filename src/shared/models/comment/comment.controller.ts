import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

import { fillDTO } from '../../helpers/index.js';
import {
  BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
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
      path: '/', method:
      HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
  }

  public async create(
    { body }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findMany({ params });
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);

  }
}
