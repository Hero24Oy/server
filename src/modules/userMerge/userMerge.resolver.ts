import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { UserMergeDto } from './dto/userMerge/userMerge.dto';
import { UserMergeService } from './userMerge.service';
import { UserMergeDB } from 'hero24-types';
import { UserMergeInput } from './dto/userMerge/userMerge.input';

@Resolver()
export class UserMergeResolver {
  constructor(private UserMergeService: UserMergeService) {}

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
}
