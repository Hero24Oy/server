import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news/news.dto';
import { NewsCreationInput } from './dto/creation/news-creation-input';
import { NewsEditingInput } from './dto/editing/news-editing.input';
import {
  NEWS_ADDED_SUBSCRIPTION,
  NEWS_REMOVED_SUBSCRIPTION,
  NEWS_UPDATED_SUBSCRIPTION,
} from './news.constants';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { NewsListDto } from './dto/news-list/news-list.dto';
import { NewsListArgs } from './dto/news-list/news-list.args';

@Resolver()
export class NewsResolver {
  constructor(
    private newsService: NewsService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => NewsDto, { nullable: true })
  @UseGuards(AuthGuard)
  async news(@Args('id') newsId: string): Promise<NewsDto | null> {
    return this.newsService.getNews(newsId);
  }

  @Query(() => NewsListDto)
  @UseGuards(AuthGuard)
  async newsList(@Args() args: NewsListArgs): Promise<NewsListDto> {
    return this.newsService.getNewsList(args);
  }

  @Mutation(() => NewsDto)
  @UseGuards(AdminGuard)
  async createNews(@Args('input') input: NewsCreationInput): Promise<NewsDto> {
    return this.newsService.createNews(input);
  }

  @Mutation(() => NewsDto)
  @UseGuards(AdminGuard)
  async editNews(@Args('input') input: NewsEditingInput): Promise<NewsDto> {
    return this.newsService.editNews(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async removeNews(@Args('id') newsId: string): Promise<boolean> {
    await this.newsService.removeNews(newsId);

    return true;
  }

  @Subscription(() => NewsDto, {
    name: NEWS_ADDED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async newsAdded() {
    return this.pubSub.asyncIterator(NEWS_ADDED_SUBSCRIPTION);
  }

  @Subscription(() => NewsDto, {
    name: NEWS_UPDATED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async newsUpdated() {
    return this.pubSub.asyncIterator(NEWS_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => NewsDto, {
    name: NEWS_REMOVED_SUBSCRIPTION,
  })
  @UseGuards(AuthGuard)
  async newsRemoved() {
    return this.pubSub.asyncIterator(NEWS_REMOVED_SUBSCRIPTION);
  }
}
