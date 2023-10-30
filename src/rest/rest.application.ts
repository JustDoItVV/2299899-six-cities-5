import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { getMongoURI } from '../shared/helpers/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { Service } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  private server: Express = express();

  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.Config) private readonly config: Config<RestSchema>,
    @inject(Service.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Service.OfferController) private readonly offerController: Controller,
    @inject(Service.UserController) private readonly userController: Controller,
    @inject(Service.ExceptionFilter) private readonly defaultExceptionFilter: ExceptionFilter,
    @inject(Service.CommentController) private readonly commentController: Controller,
    @inject(Service.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
  ) {}

  async #initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    return this.databaseClient.connect(mongoUri);
  }

  async #initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  async #initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
  }

  async #initMiddleware() {
    this.server.use(express.json());
    this.server.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  async #initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.defaultExceptionFilter.catch.bind(this.defaultExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');

    this.logger.info('Init database...');
    await this.#initDb();
    this.logger.info('Init database is completed');

    this.logger.info('Init app-level middleware');
    await this.#initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers...');
    await this.#initControllers();
    this.logger.info('Controller initialization is completed');

    this.logger.info('Init exception filters...');
    await this.#initExceptionFilters();
    this.logger.info('Exception filters initialization is compleated');

    this.logger.info('Init server...');
    await this.#initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
