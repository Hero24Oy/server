import { UserCreatedDto } from '../dto/subscriptions/user-created.dto';
import { UserUpdatedDto } from '../dto/subscriptions/user-updated.dto';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from '../user.constants';

import { AppGraphQlContext } from '$/app.types';

type UserSubscriptionType =
  | typeof USER_CREATED_SUBSCRIPTION
  | typeof USER_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, UserUpdatedDto | UserCreatedDto>;

export const UserSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (
    payload: Payload,
    _variables: unknown,
    { identity }: AppGraphQlContext,
  ): boolean => {
    const { user } = payload[type];

    if (user.id !== identity?.id) {
      return false;
    }

    return true;
  };
