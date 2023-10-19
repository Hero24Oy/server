import { MaybeType } from '$modules/common/common.types';

export type SubscriptionObject = Record<string, unknown>;

export type SubscriptionFilterCallbackProps<
  SubscriptionType,
  Payload extends SubscriptionObject,
  Variables extends MaybeType<SubscriptionObject>,
  Context extends MaybeType<SubscriptionObject>,
> = {
  context: Context;
  payload: Payload;
  type: SubscriptionType;
  variables: Variables;
};

export type SubscriptionFilterCallback<
  SubscriptionType,
  Payload extends SubscriptionObject,
  Variables extends MaybeType<SubscriptionObject>,
  Context extends MaybeType<SubscriptionObject>,
> = (
  props: SubscriptionFilterCallbackProps<
    SubscriptionType,
    Payload,
    Variables,
    Context
  >,
) => boolean;
