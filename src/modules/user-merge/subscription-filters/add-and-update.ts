import { UserMergeDto } from '../dto/user-merge/user-merge.dto';
import {
  USER_MERGE_ADDED_SUBSCRIPTION,
  USER_MERGE_UPDATED_SUBSCRIPTION,
} from '../user-merge.constants';

import { Identity } from '$modules/auth/auth.types';
import { createSubscriptionFilter } from '$utils';

type SubscriptionType =
  | typeof USER_MERGE_ADDED_SUBSCRIPTION
  | typeof USER_MERGE_UPDATED_SUBSCRIPTION;

type Payload = Record<SubscriptionType, UserMergeDto>;

type Context = { identity: Identity };

export const UserMergeAddAndUpdateSubscriptionFilter = createSubscriptionFilter<
  SubscriptionType,
  Payload,
  null,
  Context
>((props) => {
  const { payload, context, type } = props;

  const { identity } = context;
  const { userId } = payload[type];

  return userId === identity.id;
});
