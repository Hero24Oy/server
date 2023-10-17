import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import {
  USER_MERGE_ADDED_SUBSCRIPTION,
  USER_MERGE_UPDATED_SUBSCRIPTION,
} from './user-merge.constants';
import { UserMergeService } from './user-merge.service';
import { UserMergeSubscriptionFilter } from './user-merge.utils/user-merge-subscription-filter';

@Resolver()
export class UserMergeResolver {
  constructor(
    private userMergeService: UserMergeService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => UserMergeDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async userMerge(
    @AuthIdentity() identity: Identity,
  ): Promise<UserMergeDto | null> {
    return this.userMergeService.getUserMergeByIdentity(identity);
  }

  @Mutation(() => UserMergeDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async startUserMerge(
    @Args('userMergeInput') userMergeInput: UserMergeInput,
    @AuthIdentity() identity: Identity,
  ): Promise<UserMergeDto | null> {
    return this.userMergeService.startUserMerge(userMergeInput, identity);
  }

  @Subscription(() => UserMergeDto, {
    name: USER_MERGE_ADDED_SUBSCRIPTION,
    filter: UserMergeSubscriptionFilter(USER_MERGE_ADDED_SUBSCRIPTION),
  })
  @UseGuards(AuthGuard)
  subscribeOnUserMergeAddition(@AuthIdentity() _identity: Identity) {
    return this.pubSub.asyncIterator(USER_MERGE_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => UserMergeDto, {
    name: USER_MERGE_UPDATED_SUBSCRIPTION,
    filter: UserMergeSubscriptionFilter(USER_MERGE_UPDATED_SUBSCRIPTION),
  })
  @UseGuards(AuthGuard)
  subscribeOnUserMergeUpdate(@AuthIdentity() _identity: Identity) {
    return this.pubSub.asyncIterator(USER_MERGE_UPDATED_SUBSCRIPTION);
  }
}
