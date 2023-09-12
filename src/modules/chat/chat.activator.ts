import { CommonActivator } from '../common/common.activator';

import { CHAT_ACTIVATOR_METADATA_KEY } from './chat.constants';
import { ChatBaseGuardActivator } from './chat.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ChatActivator = <Args extends Record<string, any>>(
  ...activators: ChatBaseGuardActivator<Args>[]
) => CommonActivator(CHAT_ACTIVATOR_METADATA_KEY, activators);
