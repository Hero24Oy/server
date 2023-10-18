import { SubscriptionFilterCallback, SubscriptionObject } from '../types';

import { MaybeType } from '$modules/common/common.types';

export const createSubscriptionFilter = <
  SubscriptionType,
  Payload extends SubscriptionObject,
  Variables extends MaybeType<SubscriptionObject>,
  Context extends MaybeType<SubscriptionObject>,
>(
  callback: SubscriptionFilterCallback<
    SubscriptionType,
    Payload,
    Variables,
    Context
  >,
) => {
  return (type: SubscriptionType) =>
    (payload: Payload, variables: Variables, context: Context) =>
      callback({ type, payload, variables, context });
};
