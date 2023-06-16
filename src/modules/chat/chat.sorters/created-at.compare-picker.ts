import { ChatsComparePicker } from '../chat.types';

export const createdAtComparePicker: ChatsComparePicker<number> = (chat) =>
  +chat.createdAt;
