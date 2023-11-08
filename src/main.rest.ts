import 'reflect-metadata';

import { Container } from 'inversify';

import { createRestApplicationContainer, RestApplication } from './rest/index.js';
import { createAuthContainer } from './shared/models/auth/index.js';
import { createCommentContainer } from './shared/models/comment/index.js';
import { createOfferContainer } from './shared/models/offer/index.js';
import { createUserContainer } from './shared/models/user/index.js';
import { Service } from './shared/types/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Service.RestApplication);
  await application.init();
}

bootstrap();
