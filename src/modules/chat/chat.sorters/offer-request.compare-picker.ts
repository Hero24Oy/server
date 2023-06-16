import { ChatsComparePicker } from '../chat.types';

export const offerRequestComparePicker: ChatsComparePicker<string> = (chat) =>
  chat.offerRequestId || '';
