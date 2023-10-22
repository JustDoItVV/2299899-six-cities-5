import { defaultClasses, DocumentType } from '@typegoose/typegoose';

import { DocumentExists, Offer, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findOne(params: Partial<defaultClasses.Base>): Promise<DocumentType<OfferEntity> | null>;
  findOneOrCreate(params: Partial<defaultClasses.Base>, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findMany(params: Partial<defaultClasses.Base | defaultClasses.TimeStamps | Offer>, limit?: number, sortOptions?: { field: keyof Partial<defaultClasses.Base | Offer>, order: SortType }): Promise<DocumentType<OfferEntity>[] | null>;
  exists(id: string): Promise<boolean>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
}
