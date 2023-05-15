import { registerEnumType } from '@nestjs/graphql';

export enum ChatsOrderColumn {
  OFFER = 'offerId',
  OFFER_REQUEST = 'offerRequestId',
  IS_ADMIN_INVITED = 'inviteAdmin',
  IS_ABOUT_RECLAMATION = 'isAboutReclamation',
}

registerEnumType(ChatsOrderColumn, {
  name: 'ChatsOrderColumn',
});
