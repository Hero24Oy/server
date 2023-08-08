import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { UserService } from 'src/modules/user/user.service';
import { BuyerService } from 'src/modules/buyer/buyer.service';
import { SellerService } from 'src/modules/seller/seller.service';

import { ChatMemberDto } from '../dto/chat/chat-member.dto';
import { ChatMemberRole } from '../chat.types';
import { AppGraphQLContext } from 'src/app.types';

@Resolver(() => ChatMemberDto)
export class ChatMemberFieldsResolver {
  constructor(
    private userService: UserService,
    private buyerService: BuyerService,
    private sellerService: SellerService,
  ) {}

  @ResolveField(() => String, { nullable: true })
  async userName(
    @Parent() parent: ChatMemberDto,
    @Context() { userLoader }: AppGraphQLContext,
  ) {
    const user = await userLoader.load(parent.id);

    return user?.data.name;
  }

  @ResolveField(() => String, { nullable: true })
  async avatar(
    @Parent() parent: ChatMemberDto,
    @Context() { userLoader }: AppGraphQLContext,
  ) {
    const user = await userLoader.load(parent.id);

    return user?.data.photoURL;
  }

  @ResolveField(() => String, { nullable: true })
  async buyerName(@Parent() parent: ChatMemberDto) {
    if (parent.role === ChatMemberRole.ADMIN) {
      return null;
    }

    const buyerName = await this.buyerService.getFullAccessedBuyerNameById(
      parent.id,
    );

    return buyerName;
  }

  @ResolveField(() => String, { nullable: true })
  async sellerName(@Parent() parent: ChatMemberDto) {
    if (parent.role !== ChatMemberRole.SELLER) {
      return null;
    }

    const sellerName = await this.sellerService.getFullAccessedSellerNameById(
      parent.id,
    );

    return sellerName;
  }
}
