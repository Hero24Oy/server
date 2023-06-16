import { Identity } from 'src/modules/auth/auth.types';

import { AppGraphQLContext } from 'src/app.types';

import { ChatGuardProviders } from '../chat.types';

export const IsChatMember =
  <
    Args extends Record<string, any> & Record<Key, string>,
    Key extends keyof Args & string,
  >(
    key: Key,
  ) =>
  (
    args: Args,
    { identity }: AppGraphQLContext,
    { chatService }: ChatGuardProviders,
  ) =>
    chatService.checkIsMember(identity as Identity, args[key]);
