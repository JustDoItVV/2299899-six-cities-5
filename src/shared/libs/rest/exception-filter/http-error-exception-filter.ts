import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { createErrorObject } from '../../../helpers/common.js';
import { Service } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { ApplicationError, ExceptionFilter, HttpError } from '../index.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
  ) {
    this.logger.info('Registering HttpExceptionFilter...');
  }

  catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
