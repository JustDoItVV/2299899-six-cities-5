export interface OfferExists {
  exists(documentId: string): Promise<boolean>;
}
