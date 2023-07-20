import { Inject, UseFilters } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { CategoriesDto } from './dto/categories.dto';

@Resolver()
export class CategoriesResolver {
  constructor(
    private categoriesService: CategoriesService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Subscription(() => CategoriesDto)
  @UseFilters(FirebaseExceptionFilter)
  categoriesUpdated() {
    return this.pubSub.asyncIterator('categoriesUpdated');
  }
}
