import { includes, isEmpty } from 'lodash';

import { OfferRequestDto } from '../dto/offer-request/offer-request.dto';
import { OfferRequestUpdatedSubscriptionArgs } from '../dto/subscriptions/offer-request-updated-subscription.args';
import { OFFER_REQUEST_UPDATED_SUBSCRIPTION } from '../offer-request.constants';

import { AppGraphQlContext } from '$/src/app.types';
import { Scope } from '$/src/modules/auth/auth.constants';
import { OfferRole } from '$/src/modules/offer/dto/offer/offer-role.enum';

type OfferRequestSubscriptionType = typeof OFFER_REQUEST_UPDATED_SUBSCRIPTION;

type Payload = Record<OfferRequestSubscriptionType, OfferRequestDto>;

export const getOfferRequestSubscriptionFilter =
  (type: OfferRequestSubscriptionType) =>
  (
    payload: Payload,
    variables: OfferRequestUpdatedSubscriptionArgs,
    context: AppGraphQlContext,
  ) => {
    const offerRequest = payload[type];
    const { identity } = context;

    const {
      input: { role, statuses, ids },
    } = variables;

    if (!isEmpty(statuses) && !includes(statuses, offerRequest.data.status)) {
      return false;
    }

    if (!isEmpty(ids) && !includes(ids, offerRequest.id)) {
      return false;
    }

    if (identity?.scope === Scope.ADMIN) {
      return true;
    }

    const { buyerProfile } = offerRequest.data.initial;

    const isSeller = role === OfferRole.SELLER;
    const isBuyerForOffer = buyerProfile === identity?.id;

    return (!isBuyerForOffer && isSeller) || (isBuyerForOffer && !isSeller);
  };
