import { ChatService } from '$modules/chat/services/chat.service';
import { ChatMessageService } from '$modules/chat/services/chat-message.service';
import { BaseGuardActivator, RecordType } from '$modules/common/common.types';

export type ChatGuardProviders = {
  chatMessageService: ChatMessageService;
  chatService: ChatService;
};

export type ChatBaseGuardActivator<Args extends RecordType = RecordType> =
  BaseGuardActivator<Args, ChatGuardProviders>;
