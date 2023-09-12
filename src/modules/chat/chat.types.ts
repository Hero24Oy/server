import { ChatDB } from 'hero24-types';
import { BaseGuardActivator } from 'src/modules/common/common.types';

import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';

// eslint-disable-next-line import/no-cycle
import { ChatDto } from './dto/chat/chat.dto';
// eslint-disable-next-line import/no-cycle
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';

export type ChatGuardProviders = {
  chatMessageService: ChatMessageService;
  chatService: ChatService;
};

export type ChatBaseGuardActivator<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args extends Record<string, any> = Record<string, any>,
> = BaseGuardActivator<Args, ChatGuardProviders>;

export type ChatMemberDB = ChatDB['data']['members'][string];

export type ChatsSorterContext = {
  identity: Identity;
};

export type ChatsComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<ChatDto, ChatsSorterContext, Primitive>;
