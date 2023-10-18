import { CreateSubscriptionFilters, SubscriptionObject } from '../types';

import { MaybeType } from '$modules/common/common.types';

export const createSubscriptionFilterFabric =
  <
    SubscriptionType,
    Payload extends SubscriptionObject,
    Variables extends MaybeType<SubscriptionObject>,
    Context extends MaybeType<SubscriptionObject>,
  >(): CreateSubscriptionFilters<
    SubscriptionType,
    Payload,
    Variables,
    Context
  > =>
  (callback) => {
    return (type) => (payload, variables, context) =>
      callback({ type, payload, variables, context });
  };
