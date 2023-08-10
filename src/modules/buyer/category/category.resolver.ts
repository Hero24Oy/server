import { Inject, UseFilters } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { CategoryDto } from './dto/category.dto';
import { CATEGORIES_UPDATED_SUBSCRIPTION } from './category.constants';

@Resolver()
export class CategoryResolver {
  constructor(
    private categoryService: CategoryService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Subscription(() => CategoryDto)
  @UseFilters(FirebaseExceptionFilter)
  categoriesUpdated() {
    return this.pubSub.asyncIterator(CATEGORIES_UPDATED_SUBSCRIPTION);
  }
}
