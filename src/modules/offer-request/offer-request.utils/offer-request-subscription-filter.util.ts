import { AppGraphQLContext } from 'src/app.types';
import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from '../offer-request.constants';
import { Scope } from 'src/modules/auth/auth.constants';
import { OfferRequestUpdatedSubscriptionArgs } from '../dto/subscriptions/offer-request-updated-subscription.args';
import { OfferRole } from 'src/modules/offer/dto/offer/offer-role.enum';

type OfferRequestSubscriptionType = typeof OFFER_REQUEST_UPDATED_SUBSCRIPTION;

type Payload = Record<OfferRequestSubscriptionType, OfferRequestDto>;

export const getOfferRequestSubscriptionFilter =
  (type: OfferRequestSubscriptionType) =>
  (
    payload: Payload,
    variables: OfferRequestUpdatedSubscriptionArgs,
    context: AppGraphQLContext,
  ) => {
    const offerRequest = payload[type];
    const { identity } = context;
    const { role } = variables;

    if (identity?.scope === Scope.ADMIN) {
      return true;
    }

    const { buyerProfile } = offerRequest.data.initial;

    const isSeller = role !== OfferRole.SELLER;
    const isBuyerForOffer = buyerProfile === identity?.id;

    if ((!isBuyerForOffer && isSeller) || (isBuyerForOffer && !isSeller)) {
      return true;
    }

    return false;
  };
