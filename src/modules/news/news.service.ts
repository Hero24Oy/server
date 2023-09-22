import { Injectable } from '@nestjs/common';
import { NewsDB } from 'hero24-types';

import {
  omitUndefined,
  paginate,
  preparePaginatedResult,
} from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { NewsCreationInput } from './dto/creation/news-creation-input';
import { NewsEditingInput } from './dto/editing/news-editing.input';
import { NewsDto } from './dto/news/news.dto';
import { NewsListArgs } from './dto/news-list/news-list.args';
import { NewsListDto } from './dto/news-list/news-list.dto';
import { isNewsActive } from './news.utils/is-news-active.util';

@Injectable()
export class NewsService {
  private readonly newsTableRef: FirebaseTableReference<NewsDB>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.newsTableRef = database.ref(FirebaseDatabasePath.NEWS);
  }

  async getNews(id: string): Promise<NewsDto | null> {
    const newsSnapshot = await this.newsTableRef.child(id).get();

    const news = newsSnapshot.val();

    return news && NewsDto.convertFromFirebaseType(news, id);
  }

  async strictGetNews(id: string): Promise<NewsDto> {
    const news = await this.getNews(id);

    if (!news) {
      throw new Error(`News with id ${id} is not found`);
    }

    return news;
  }

  private async getAllNews(): Promise<NewsDto[]> {
    const newsTableSnapshot = await this.newsTableRef.get();

    const newsTable = newsTableSnapshot.val() || {};

    return Object.entries(newsTable).map(([id, news]) =>
      NewsDto.convertFromFirebaseType(news, id),
    );
  }

  async getNewsList(args: NewsListArgs): Promise<NewsListDto> {
    const newsList = await this.getAllNews();

    const { offset, limit, filter } = args;

    let nodes = newsList;

    if (typeof filter?.isActive === 'boolean') {
      nodes = nodes.filter((news) =>
        isNewsActive(news) ? filter.isActive : !filter.isActive,
      );
    }

    const total = nodes.length;

    nodes = paginate({ nodes, offset, limit });

    return preparePaginatedResult({
      limit,
      offset,
      nodes,
      total,
    });
  }

  async createNews(input: NewsCreationInput): Promise<NewsDto> {
    const { description, title, startAt, endAt, label, link } = input;

    const news: NewsDB = {
      label,
      title,
      description,
      link: link || null,
      startAt: Number(startAt),
      endAt: Number(endAt),
    };

    const { key } = await this.newsTableRef.push(news);

    if (!key) {
      throw new Error("News wasn't created");
    }

    return this.strictGetNews(key);
  }

  async editNews(input: NewsEditingInput): Promise<NewsDto> {
    const { title, description, label, link, startAt, endAt, id } = input;

    const newsUpdates = omitUndefined<Partial<NewsDB>>({
      title: title ?? undefined,
      description: description ?? undefined,
      label: label ?? undefined,
      link: link ?? undefined,
      startAt: startAt ? Number(startAt) : undefined,
      endAt: endAt ? Number(endAt) : undefined,
    });

    await this.newsTableRef.child(id).update(newsUpdates);

    return this.strictGetNews(id);
  }

  async removeNews(newsId: string): Promise<void> {
    await this.newsTableRef.child(newsId).remove();
  }
}
