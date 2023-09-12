import { CommonActivator } from '../common/common.activator';

import { ChatBaseGuardActivator } from './activators/chat-member.activator';
import { CHAT_ACTIVATOR_METADATA_KEY } from './chat.constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- We need any here
export const ChatActivator = <Args extends Record<string, any>>(
  ...activators: ChatBaseGuardActivator<Args>[]
) => CommonActivator(CHAT_ACTIVATOR_METADATA_KEY, activators);
