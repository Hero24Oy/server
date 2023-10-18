import { UserMergeDto } from '../dto/user-merge/user-merge.dto';
import {
  USER_MERGE_ADDED_SUBSCRIPTION,
  USER_MERGE_UPDATED_SUBSCRIPTION,
} from '../user-merge.constants';

import { Identity } from '$modules/auth/auth.types';
import { createSubscriptionFilterFabric } from '$utils';

type SubscriptionType =
  | typeof USER_MERGE_ADDED_SUBSCRIPTION
  | typeof USER_MERGE_UPDATED_SUBSCRIPTION;

type Payload = Record<SubscriptionType, UserMergeDto>;

type Context = { identity: Identity };

export const SubscriptionFilterFabric = createSubscriptionFilterFabric<
  SubscriptionType,
  Payload,
  null,
  Context
>();

export const UserMergeAddAndUpdateSubscriptionFilter = SubscriptionFilterFabric(
  (props) => {
    const { payload, context, type } = props;

    const { identity } = context;
    const { userId } = payload[type];

    return userId === identity.id;
  },
);
