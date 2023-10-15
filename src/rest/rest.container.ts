import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Service } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { DefaultExceptionFilter, ExceptionFilter } from '../shared/libs/rest/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Service.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Service.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Service.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Service.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Service.ExceptionFilter).to(DefaultExceptionFilter).inSingletonScope();

  return restApplicationContainer;
}
