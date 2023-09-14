import { ChatDto } from '../dto/chat/chat.dto';

export const hasMemberSeenChat = (memberId: string, chat: ChatDto) => {
  const member = chat.members.find((memberDto) => memberDto.id === memberId);

  if (!member) {
    return false;
  }

  if (!chat.lastMessageDate) {
    return true;
  }

  if (!member.lastOpened) {
    return false;
  }

  const lastOpened = +member.lastOpened;
  const lastMessageDate = +chat.lastMessageDate;

  return lastOpened >= lastMessageDate;
};
