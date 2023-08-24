import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { CategoryDto } from './dto/category.dto';
import { CATEGORIES_UPDATED_SUBSCRIPTION } from './category.constants';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FirebaseAppInstance } from 'src/modules/firebase/firebase.types';
import { FirebaseApp } from 'src/modules/firebase/firebase.decorator';

@Resolver()
export class CategoryResolver {
  constructor(
    private categoryService: CategoryService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => [CategoryDto], { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async getCategories(): Promise<CategoryDto[] | null> {
    return this.categoryService.getAllCategories();
  }

  @Subscription(() => CategoryDto)
  @UseFilters(FirebaseExceptionFilter)
  categoriesUpdated() {
    return this.pubSub.asyncIterator(CATEGORIES_UPDATED_SUBSCRIPTION);
  }
}
