import { ChatService } from '../../services/chat.service';
import { ChatMessageService } from '../../services/chat-message.service';

import { BaseGuardActivator } from '$modules/common/common.types';

export type ChatBaseGuardActivator<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
  Args extends Record<string, any> = Record<string, any>,
> = BaseGuardActivator<Args, ChatGuardProviders>;

export type ChatGuardProviders = {
  chatMessageService: ChatMessageService;
  chatService: ChatService;
};
