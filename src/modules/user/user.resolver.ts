import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { UserService } from './user.service';
import { UserSubscriptionFilter } from './user.utils/user-subscription-filter.util';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => UserDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async user(@Args('id') userId: string): Promise<UserDto | null> {
    return this.userService.getUserById(userId);
  }

  @Query(() => UserListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async users(@Args() args: UsersArgs): Promise<UserListDto> {
    return this.userService.getUsers(args);
  }

  @Query(() => String)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async phone(@Args('userId') userId: string): Promise<string> {
    return this.userService.getUserPhone(userId);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createUser(@Args() args: UserCreationArgs): Promise<UserDto> {
    const user = await this.userService.createUser(args);

    return user;
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editUserData(@Args() args: UserDataEditingArgs): Promise<UserDto> {
    const beforeUpdateUser = await this.userService.getUserById(args.userId);

    if (!beforeUpdateUser) {
      throw new Error('User not found');
    }

    const user = await this.userService.editUserData(args);

    return user;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async unbindUserOfferRequests(
    @Args('userId', { type: () => String }) userId: string,
    @Args('offerRequestIds', { type: () => [String] })
    offerRequestIds: string[],
  ): Promise<boolean> {
    return this.userService.unbindUserOfferRequests(userId, offerRequestIds);
  }

  @Subscription(() => UserDto, {
    name: USER_UPDATED_SUBSCRIPTION,
    filter: UserSubscriptionFilter(USER_UPDATED_SUBSCRIPTION),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnUserUpdate(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(USER_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => UserDto, {
    name: USER_CREATED_SUBSCRIPTION,
    filter: UserSubscriptionFilter(USER_CREATED_SUBSCRIPTION),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeOnUserCreate(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(USER_CREATED_SUBSCRIPTION);
  }
}
