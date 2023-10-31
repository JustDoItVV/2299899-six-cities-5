import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { createErrorObject } from '../../../helpers/index.js';
import { Service } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { ApplicationError } from '../index.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Registering DefaultExceptionFilter...');
  }

  public catch(error: Error, _req: Request, res: Response): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
