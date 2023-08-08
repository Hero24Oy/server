import { BaseGuardActivator } from 'src/modules/common/common.types';

import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';
import { ChatDB } from 'hero24-types';
import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';
import { ChatDto } from './dto/chat/chat.dto';

export type ChatGuardProviders = {
  chatService: ChatService;
  chatMessageService: ChatMessageService;
};

export type ChatBaseGuardActivator<
  Args extends Record<string, any> = Record<string, any>,
> = BaseGuardActivator<Args, ChatGuardProviders>;

export type ChatMemberDB = ChatDB['data']['members'][string];

export type ChatsSorterContext = {
  identity: Identity;
};

export type ChatsComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<ChatDto, ChatsSorterContext, Primitive>;
