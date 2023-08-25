import { AppGraphQLContext } from 'src/app.types';
import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from '../offer-request.constants';
import { Scope } from 'src/modules/auth/auth.constants';

type OfferRequestSubscriptionType = typeof OFFER_REQUEST_UPDATED_SUBSCRIPTION;

type Payload = Record<OfferRequestSubscriptionType, OfferRequestDto>;

export const getOfferRequestSubscriptionFilter =
  (type: OfferRequestSubscriptionType) =>
  (payload: Payload, _variables: unknown, context: AppGraphQLContext) => {
    const offerRequest = payload[type];
    const { identity } = context;

    if (identity?.scope === Scope.ADMIN) {
      return true;
    }

    if (offerRequest.data.initial.buyerProfile === identity?.id) {
      return true;
    }

    return false;
  };
