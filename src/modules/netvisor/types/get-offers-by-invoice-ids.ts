import { OfferDto } from '$modules/offer/dto/offer/offer.dto';

export type GetOffersByInvoiceIdsFrom = (ids: string[]) => Promise<OfferDto[]>;
