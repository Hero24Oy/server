import { UserMergeDto } from '../dto/user-merge/user-merge.dto';
import {
  USER_MERGE_ADDED_SUBSCRIPTION,
  USER_MERGE_UPDATED_SUBSCRIPTION,
} from '../user-merge.constants';

import { Identity } from '$modules/auth/auth.types';

type UserMergeSubscriptionType =
  | typeof USER_MERGE_ADDED_SUBSCRIPTION
  | typeof USER_MERGE_UPDATED_SUBSCRIPTION;

type Payload = Record<UserMergeSubscriptionType, UserMergeDto>;

export const UserMergeSubscriptionFilter =
  (type: UserMergeSubscriptionType) =>
  (
    payload: Payload,
    _variables: null,
    { identity }: { identity: Identity },
  ): boolean => {
    const { userId } = payload[type];

    return userId === identity.id;
  };
