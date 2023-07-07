import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { UserMergeDto } from './dto/user-merge/user-merge.dto';
import { UserMergeService } from './user-merge.service';
import { UserMergeInput } from './dto/user-merge/user-merge.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

@Resolver()
export class UserMergeResolver {
  constructor(
    private UserMergeService: UserMergeService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Mutation(() => UserMergeDto)
  @UseFilters(FirebaseExceptionFilter)
  async startUserMerge(
    @Args('userMergeInput') userMergeInput: UserMergeInput,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserMergeDto | null> {
    return await this.UserMergeService.startUserMerge(userMergeInput, app);
  }

  @Subscription(() => UserMergeDto)
  @UseGuards(AuthGuard)
  subscribeToUserMerge(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator('userMerge');
  }
}
