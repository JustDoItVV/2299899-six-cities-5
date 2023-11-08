import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Logger } from '../../libs/logger/index.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { BaseUserException } from './index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
  ) {
    this.logger.info('Registering AuthExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthService] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
