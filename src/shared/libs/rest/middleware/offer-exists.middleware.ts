import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OfferExists } from '../../../types/index.js';
import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

export class OfferExistsMiddleware implements Middleware {
  constructor(
    private readonly service: OfferExists,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const offerId = params[this.paramName];

    if (!await this.service.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ${offerId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
