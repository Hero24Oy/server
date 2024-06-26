import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { ChatMemberDto } from '../dto/chat/chat-member.dto';
import { ChatMemberRole } from '../dto/chat/chat-member-role.enum';

import { AppGraphQlContext } from '$/app.types';

@Resolver(() => ChatMemberDto)
export class ChatMemberFieldsResolver {
  @ResolveField(() => String, { nullable: true })
  async userName(
    @Parent() parent: ChatMemberDto,
    @Context() { userLoader }: AppGraphQlContext,
  ) {
    const user = await userLoader.load(parent.id);

    return user?.data.name;
  }

  @ResolveField(() => String, { nullable: true })
  async avatar(
    @Parent() parent: ChatMemberDto,
    @Context() { userLoader }: AppGraphQlContext,
  ) {
    const user = await userLoader.load(parent.id);

    return user?.data.photoURL;
  }

  @ResolveField(() => String, { nullable: true })
  async buyerName(
    @Parent() parent: ChatMemberDto,
    @Context() { buyerLoader }: AppGraphQlContext,
  ) {
    if (parent.role === ChatMemberRole.ADMIN) {
      return null;
    }

    const buyer = await buyerLoader.load(parent.id);

    return buyer?.data.displayName;
  }

  @ResolveField(() => String, { nullable: true })
  async sellerName(
    @Parent() parent: ChatMemberDto,
    @Context() { sellerLoader }: AppGraphQlContext,
  ) {
    if (parent.role !== ChatMemberRole.SELLER) {
      return null;
    }

    const seller = await sellerLoader.load(parent.id);

    return seller?.data.companyName;
  }
}
