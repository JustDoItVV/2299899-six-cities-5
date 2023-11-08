import { Container } from 'inversify';

import { types } from '@typegoose/typegoose';

import { Controller } from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferService } from './interface/offer-service.interface.js';
import { OfferController } from './offer.controller.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Service.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Service.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Service.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
