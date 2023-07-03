import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { UserMergeDto } from './dto/userMerge/userMerge.dto';
import { UserMergeService } from './userMerge.service';
import { UserMergeInput } from './dto/userMerge/userMerge.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

@Resolver()
export class UserMergeResolver {
  constructor(
    private UserMergeService: UserMergeService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => UserMergeDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async getUserMergeByUserId(
    @Args('userId') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserMergeDto | null> {
    return await this.UserMergeService.getUserMergeByUserId(userId);
  }

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
