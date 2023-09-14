import { ChatsComparePicker } from '../chat.types';

export const hasUnreadMessagesComparePicker: ChatsComparePicker<number> = (
  chat,
  { identity },
) => {
  const member = chat.members.find((memberDto) => memberDto.id === identity.id);

  if (!member) {
    return 0;
  }

  if (!chat.lastMessageDate) {
    return 0;
  }

  if (!member.lastOpened) {
    return 1;
  }

  return +member.lastOpened >= +chat.lastMessageDate ? 0 : 1;
};
