import { Config } from '../shared/libs/config/config.interface.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';

export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $REST_PORT: ${this.config.get('REST_PORT')}`);
  }
}
