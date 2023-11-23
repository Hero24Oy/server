import { CategoryDB } from 'hero24-types';
import moment from 'moment-timezone';

import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';

// * minimumDuration could be set on offerRequest, if not - use default
export const getMinimumOfferDuration = (
  offerRequest: OfferRequestDto,
  category: CategoryDB,
): moment.Duration => {
  const hours = offerRequest.minimumDuration ?? category.minimumDuration;

  return moment.duration(hours, 'h');
};
