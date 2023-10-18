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

export type CreateSubscriptionFilters<
  SubscriptionType,
  Payload extends SubscriptionObject,
  Variables extends MaybeType<SubscriptionObject>,
  Context extends MaybeType<SubscriptionObject>,
> = (
  callback: (
    props: SubscriptionFilterCallbackProps<
      SubscriptionType,
      Payload,
      Variables,
      Context
    >,
  ) => boolean,
) => (
  type: SubscriptionType,
) => (payload: Payload, variables: Variables, context: Context) => boolean;
