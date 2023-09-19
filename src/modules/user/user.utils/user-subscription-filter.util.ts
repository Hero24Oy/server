import { UserDto } from '../dto/user/user.dto';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from '../user.constants';

import { AppGraphQlContext } from '$/app.types';

type UserSubscriptionType =
  | typeof USER_CREATED_SUBSCRIPTION
  | typeof USER_UPDATED_SUBSCRIPTION;

type Payload = Record<UserSubscriptionType, UserDto>;

export const UserSubscriptionFilter =
  (type: UserSubscriptionType) =>
  (
    payload: Payload,
    _variables: unknown,
    { identity }: AppGraphQlContext,
  ): boolean => {
    const user = payload[type];

    if (user.id !== identity?.id) {
      return false;
    }

    return true;
  };
