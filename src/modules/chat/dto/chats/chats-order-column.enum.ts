import { registerEnumType } from '@nestjs/graphql';

export enum ChatsOrderColumn {
  OFFER = 'offerId',
  OFFER_REQUEST = 'offerRequestId',
  IS_ADMIN_INVITED = 'inviteAdmin',
  IS_ABOUT_RECLAMATION = 'isAboutReclamation',
  LAST_MESSAGE_DATE = 'lastMessageDate',
  CREATED_AT = 'createdAt',
  HAS_UNREAD_MESSAGES = 'hasUnreadMessages',
}

registerEnumType(ChatsOrderColumn, {
  name: 'ChatsOrderColumn',
});
