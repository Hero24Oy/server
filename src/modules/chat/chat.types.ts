import { Identity } from '../auth/auth.types';
import { ComparePicker, SortablePrimitives } from '../sorter/sorter.types';

import { ChatDto } from './dto/chat/chat.dto';

export type ChatsSorterContext = {
  identity: Identity;
};

export type ChatsComparePicker<
  Primitive extends SortablePrimitives = SortablePrimitives,
> = ComparePicker<ChatDto, ChatsSorterContext, Primitive>;
