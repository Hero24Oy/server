import { ChatsComparePicker } from '../chat.types';

export const isAboutReclamationComparePicker: ChatsComparePicker<number> = (
  chat,
) => (chat.isAboutReclamation ? 1 : 0);
