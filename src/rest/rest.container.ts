import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Service } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Service.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Service.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Service.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Service.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return restApplicationContainer;
}
