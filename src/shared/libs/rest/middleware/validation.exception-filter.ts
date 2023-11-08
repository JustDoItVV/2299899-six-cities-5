import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { createErrorObject } from '../../../helpers/common.js';
import { Service } from '../../../types/service.enum.js';
import { Logger } from '../../logger/logger.interface.js';
import { ApplicationError, ExceptionFilter, ValidationError } from '../index.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
  ) {
    this.logger.info('Registering ValidationExceptionFilter...');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);

    error.details.forEach((errorField) => this.logger.warn(`[${errorField.property}] - ${errorField.messages}`));

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
