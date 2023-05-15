import { ChatsOrderColumn } from './dto/chats/chats-order-column.enum';

export const ChatColumnDefaultValues = {
  [ChatsOrderColumn.OFFER]: '',
  [ChatsOrderColumn.OFFER_REQUEST]: '',
  [ChatsOrderColumn.IS_ABOUT_RECLAMATION]: false,
  [ChatsOrderColumn.IS_ADMIN_INVITED]: false,
};

export const CHAT_UPDATED_SUBSCRIPTION = 'chatUpdated';
export const CHAT_ADDED_SUBSCRIPTION = 'chatAdded';
export const CHAT_SEEN_BY_ADMIN_UPDATED_SUBSCRIPTION = 'seenByAdminUpdated';
