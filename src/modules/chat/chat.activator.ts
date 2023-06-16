import { CommonActivator } from '../common/common.activator';
import { ChatBaseGuardActivator } from './chat.types';
import { CHAT_ACTIVATOR_METADATA_KEY } from './chat.constants';

export const ChatActivator = <Args extends Record<string, any>>(
  ...activators: ChatBaseGuardActivator<Args>[]
) => CommonActivator(CHAT_ACTIVATOR_METADATA_KEY, activators);
