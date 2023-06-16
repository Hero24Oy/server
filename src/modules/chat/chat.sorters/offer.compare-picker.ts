import { ChatsComparePicker } from '../chat.types';

export const offerComparePicker: ChatsComparePicker<string> = (chat) =>
  chat.offerId || '';
