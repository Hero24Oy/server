import { registerEnumType } from '@nestjs/graphql';

export enum ChatMemberRole {
  SELLER = 'seller',
  CUSTOMER = 'buyer',
  ADMIN = 'admin',
}

registerEnumType(ChatMemberRole, {
  name: 'ChatMemberRole',
});
