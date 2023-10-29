import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import {
  CATEGORY_CREATED_SUBSCRIPTION,
  CATEGORY_UPDATED_SUBSCRIPTION,
} from './constants';
import {
  CategoryObject,
  GetCategoriesOutput,
  SubscribeToCategoriesUpdatedOutput,
} from './graphql';
import { CategoryService } from './service';

@Resolver()
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [GetCategoriesOutput], { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  // @UseGuards(AuthGuard)
  async getCategories(): Promise<GetCategoriesOutput[] | null> {
    return this.categoryService.getAllCategories();
  }

  @Subscription(() => GetCategoriesOutput, {
    name: CATEGORY_CREATED_SUBSCRIPTION,
    resolve: (payload: {
      [CATEGORY_CREATED_SUBSCRIPTION]: CategoryObject;
    }): GetCategoriesOutput => ({
      category: payload[CATEGORY_CREATED_SUBSCRIPTION],
    }),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeToCategoriesCreated(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(CATEGORY_CREATED_SUBSCRIPTION);
  }

  @Subscription(() => SubscribeToCategoriesUpdatedOutput, {
    name: CATEGORY_UPDATED_SUBSCRIPTION,
    resolve: (payload: {
      [CATEGORY_UPDATED_SUBSCRIPTION]: CategoryObject;
    }): SubscribeToCategoriesUpdatedOutput => ({
      category: payload[CATEGORY_UPDATED_SUBSCRIPTION],
    }),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeToCategoriesUpdated(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(CATEGORY_UPDATED_SUBSCRIPTION);
  }
}
