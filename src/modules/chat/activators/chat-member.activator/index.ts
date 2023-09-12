import { ChatGuardProviders } from './types';

import { AppGraphQlContext } from '$/src/app.types';
import { Identity } from '$/src/modules/auth/auth.types';

export const IsChatMember =
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
    Args extends Record<string, any> & Record<Key, string>,
    Key extends keyof Args & string,
  >(
    key: Key,
  ) =>
  (
    args: Args,
    { identity }: AppGraphQlContext,
    { chatService }: ChatGuardProviders,
  ) =>
    chatService.checkIsMember(identity as Identity, args[key]);

export * from './types';
