import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Service } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register DefaultExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}
