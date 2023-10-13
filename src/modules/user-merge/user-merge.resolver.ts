import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import { UserMergeService } from './user-merge.service';

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
    return this.pubSub.asyncIterator('userMerge'); // TODO there is no such event, look user-merge.constants.ts
  }
}
