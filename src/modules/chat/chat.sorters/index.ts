import { ChatsComparePicker } from '../chat.types';
import { ChatsOrderColumn } from '../dto/chats/chats-order-column.enum';

import { createdAtComparePicker } from './created-at.compare-picker';
import { hasUnreadMessagesComparePicker } from './has-unread-messages.compare-picker';
import { isAboutReclamationComparePicker } from './is-about-reclamation.compare-picker';
import { isAdminInvitedComparePicker } from './is-admin-invited.compare-picker';
import { lastMessageDateComparePicker } from './last-message-date.compare-picker';
import { offerComparePicker } from './offer.compare-picker';
import { offerRequestComparePicker } from './offer-request.compare-picker';

export const CHAT_SORTERS: Record<ChatsOrderColumn, ChatsComparePicker> = {
  [ChatsOrderColumn.CREATED_AT]: createdAtComparePicker,
  [ChatsOrderColumn.IS_ABOUT_RECLAMATION]: isAboutReclamationComparePicker,
  [ChatsOrderColumn.IS_ADMIN_INVITED]: isAdminInvitedComparePicker,
  [ChatsOrderColumn.LAST_MESSAGE_DATE]: lastMessageDateComparePicker,
  [ChatsOrderColumn.OFFER]: offerComparePicker,
  [ChatsOrderColumn.OFFER_REQUEST]: offerRequestComparePicker,
  [ChatsOrderColumn.HAS_UNREAD_MESSAGES]: hasUnreadMessagesComparePicker,
};
