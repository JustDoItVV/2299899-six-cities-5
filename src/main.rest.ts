import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';
import { Service } from './shared/types/index.js';
import { createUserContainer } from './shared/models/user/index.js';
import { createOfferContainer } from './shared/models/offer/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
  );

  const application = appContainer.get<RestApplication>(Service.RestApplication);
  await application.init();
}

bootstrap();
