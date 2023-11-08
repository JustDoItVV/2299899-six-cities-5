import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

export class IsAnonymusMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden for authorized users', 'PublicOnlyMiddleware');
    }

    return next();
  }
}
