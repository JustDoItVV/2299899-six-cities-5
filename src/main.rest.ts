import 'reflect-metadata';
import { Container } from 'inversify';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { RestApplication } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { Service } from './shared/types/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Service.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Service.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Service.Config).to(RestConfig).inSingletonScope();
  container.bind <DatabaseClient>(Service.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const application = container.get<RestApplication>(Service.RestApplication);
  await application.init();
}

bootstrap();
