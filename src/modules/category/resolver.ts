import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import {
  CATEGORIES_CREATED_SUBSCRIPTION,
  CATEGORIES_UPDATED_SUBSCRIPTION,
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
  @UseGuards(AuthGuard)
  async getCategories(): Promise<GetCategoriesOutput[] | null> {
    return this.categoryService.getAllCategories();
  }

  @Subscription(() => GetCategoriesOutput, {
    name: CATEGORIES_CREATED_SUBSCRIPTION,
    resolve: (payload: {
      [CATEGORIES_CREATED_SUBSCRIPTION]: CategoryObject;
    }): GetCategoriesOutput => ({
      category: payload[CATEGORIES_CREATED_SUBSCRIPTION],
    }),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeToCategoriesCreated(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(CATEGORIES_CREATED_SUBSCRIPTION);
  }

  @Subscription(() => SubscribeToCategoriesUpdatedOutput, {
    name: CATEGORIES_UPDATED_SUBSCRIPTION,
    resolve: (payload: {
      [CATEGORIES_UPDATED_SUBSCRIPTION]: CategoryObject;
    }): SubscribeToCategoriesUpdatedOutput => ({
      category: payload[CATEGORIES_UPDATED_SUBSCRIPTION],
    }),
  })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  subscribeToCategoriesUpdated(): AsyncIterator<unknown> {
    return this.pubSub.asyncIterator(CATEGORIES_UPDATED_SUBSCRIPTION);
  }
}
