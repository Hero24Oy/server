import { SubscriptionFilterCallbackProps, SubscriptionObject } from '../types';

import { MaybeType } from '$modules/common/common.types';

export const createSubscriptionFilter = <
  SubscriptionType,
  Payload extends SubscriptionObject,
  Variables extends MaybeType<SubscriptionObject>,
  Context extends MaybeType<SubscriptionObject>,
>(
  callback: (
    props: SubscriptionFilterCallbackProps<
      SubscriptionType,
      Payload,
      Variables,
      Context
    >,
  ) => boolean,
) => {
  return (type: SubscriptionType) =>
    (payload: Payload, variables: Variables, context: Context) =>
      callback({ type, payload, variables, context });
};
