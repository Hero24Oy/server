import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';

import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeService } from './user-merge.service';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { Identity } from '../auth/auth.types';
import { AuthIdentity } from '../auth/auth.decorator';

@Resolver()
export class UserMergeResolver {
  constructor(
    private userMergeService: UserMergeService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Mutation(() => UserMergeDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async startUserMerge(
    @Args('userMergeInput') userMergeInput: UserMergeInput,
    @AuthIdentity() identity: Identity,
  ): Promise<UserMergeDto | null> {
    return this.userMergeService.startUserMerge(userMergeInput, identity);
  }

  @Subscription(() => UserMergeDto)
  @UseGuards(AuthGuard)
  subscribeToUserMerge(@Args('userId') _userId: string) {
    return this.pubSub.asyncIterator('userMerge');
  }
}
