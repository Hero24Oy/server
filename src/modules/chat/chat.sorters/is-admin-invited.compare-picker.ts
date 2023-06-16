import { ChatsComparePicker } from '../chat.types';

export const isAdminInvitedComparePicker: ChatsComparePicker<number> = (chat) =>
  chat.inviteAdmin ? 1 : 0;
