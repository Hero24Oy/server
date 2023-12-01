import { CategoryDB } from 'hero24-types';

import { OfferDto } from '$modules/offer/dto/offer/offer.dto';
import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';

export type FeesCost = {
  grossFeeCost: number;
  netFeeCost: number;
};

export type CalculateWorkDurationReturnType = {
  actualDurationInH: number;
  minimumDurationInH: number;
  purchasedDurationInH: number;
  workedDurationInH: number;
};

export type FetchRequiredData = {
  category: CategoryDB;
  task: OfferDto;
  taskRequest: OfferRequestDto;
};
