import { ChatsComparePicker } from '../chat.types';

export const lastMessageDateComparePicker: ChatsComparePicker<number> = (
  chat,
) => (chat.lastMessageDate ? +chat.lastMessageDate : 0);
