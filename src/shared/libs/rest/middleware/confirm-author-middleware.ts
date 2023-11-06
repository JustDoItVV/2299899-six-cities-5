import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import { OfferService } from '../../../models/offer/index.js';
import { HttpError } from '../errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export class ConfirmAuthorMiddleware implements Middleware {
  constructor(
    private readonly service: OfferService,
    private readonly paramName: string,
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const offerId = params[this.paramName];
    const offer = await this.service.findOne({ _id: new Types.ObjectId(offerId) });

    if (offer?.authorId.id === tokenPayload.id) {
      return next();
    }

    throw new HttpError(
      StatusCodes.FORBIDDEN,
      `Offer ${offerId} doesn't belong to authorId ${tokenPayload.id}`,
      'ValidateObjectIdMiddleware'
    );
  }
}
