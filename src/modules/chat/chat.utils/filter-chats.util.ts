import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import { Scope } from 'src/modules/auth/auth.constants';

import { Identity } from '../../auth/auth.types';
import { MaybeType } from '../../common/common.types';
import { ChatDto } from '../dto/chat/chat.dto';
import { ChatMemberRole } from '../dto/chat/chat-member-role.enum';
import { ChatsFilterInput } from '../dto/chats/chats-filter.input';

type FilterChatsProps = {
  chats: ChatDto[];
  identity: Identity;
  filter?: MaybeType<ChatsFilterInput>;
};

export const filterChats = (props: FilterChatsProps) => {
  const { chats: allChats, identity, filter } = props;

  let rawChats: ChatDto[] = allChats;

  if (identity.scope === Scope.USER) {
    rawChats = rawChats.filter((chat) =>
      chat.members.some((member) => member.id === identity.id),
    );
  }

  if (!filter) {
    return rawChats;
  }

  const {
    isAboutReclamation,
    isAdminInvited,
    orderIdSearch,
    sellerIds,
    customerIds,
  } = filter;

  let chats = rawChats;

  if (isBoolean(isAboutReclamation)) {
    chats = chats.filter(
      (chat) => Boolean(chat.isAboutReclamation) === isAboutReclamation,
    );
  }

  if (isBoolean(isAdminInvited)) {
    chats = chats.filter(
      (chat) => Boolean(chat.inviteAdmin) === isAdminInvited,
    );
  }

  if (isString(orderIdSearch)) {
    const searchQuery = orderIdSearch.trim();

    chats = chats.filter(
      (chat) =>
        chat.offerId?.includes(searchQuery) ||
        chat.offerRequestId?.includes(searchQuery),
    );
  }

  if (isArray(sellerIds)) {
    chats = chats.filter((chat) =>
      chat.members.some(
        ({ role, id }) =>
          role === ChatMemberRole.SELLER && sellerIds.includes(id),
      ),
    );
  }

  if (isArray(customerIds)) {
    chats = chats.filter((chat) =>
      chat.members.some(
        ({ role, id }) =>
          role === ChatMemberRole.CUSTOMER && customerIds.includes(id),
      ),
    );
  }

  return chats;
};
