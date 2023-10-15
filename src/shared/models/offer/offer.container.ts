import { Container } from 'inversify';
import { Service } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { Controller } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Service.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Service.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Service.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
