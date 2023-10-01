import { Logger } from '../shared/libs/logger/logger.interface.js';

export class RestApplication {
  constructor(private readonly logger: Logger) {}

  public async init() {
    this.logger.info('Application initialization');
  }
}
