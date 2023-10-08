import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';
import { Service } from './shared/types/index.js';
import { createUserContainer } from './shared/models/user/user.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer()
  );

  const application = appContainer.get<RestApplication>(Service.RestApplication);
  await application.init();
}

bootstrap();
