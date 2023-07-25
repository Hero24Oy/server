import { Injectable } from '@nestjs/common';
import { NewsDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { NewsDto } from './dto/news/news.dto';
import { NewsCreationInput } from './dto/creation/news-creation-input';
import { NewsEditingInput } from './dto/editing/news-editing.input';
import {
  omitUndefined,
  paginate,
  preparePaginatedResult,
} from '../common/common.utils';
import { NewsListDto } from './dto/news-list/news-list.dto';
import { NewsListArgs } from './dto/news-list/news-list.args';
import { isNewsActive } from './news.utils/is-news-active.util';

@Injectable()
export class NewsService {
  constructor(private firebaseService: FirebaseService) {}

  async getNews(id: string): Promise<NewsDto | null> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const newsSnapshot = await database
      .ref(FirebaseDatabasePath.NEWS)
      .child(id)
      .once('value');

    const news: NewsDB | null = newsSnapshot.val();

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
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const newsTableSnapshot = await database
      .ref(FirebaseDatabasePath.NEWS)
      .once('value');

    const newsList: NewsDto[] = [];

    newsTableSnapshot.forEach((newsSnapshot) => {
      const newsId = newsSnapshot.key;

      if (newsId) {
        newsList.push(
          NewsDto.convertFromFirebaseType(newsSnapshot.val(), newsId),
        );
      }
    });

    return newsList;
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
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const { description, title, startAt, endAt, label, link } = input;

    const news: NewsDB = {
      label,
      title,
      description,
      link: link || null,
      startAt: Number(startAt),
      endAt: Number(endAt),
    };

    const { key } = await database.ref(FirebaseDatabasePath.NEWS).push(news);

    if (!key) {
      throw new Error("News wasn't created");
    }

    return this.strictGetNews(key);
  }

  async editNews(input: NewsEditingInput): Promise<NewsDto> {
    const { title, description, label, link, startAt, endAt, id } = input;

    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const newsUpdates = omitUndefined<Partial<NewsDB>>({
      title: title ?? undefined,
      description: description ?? undefined,
      label: label ?? undefined,
      link: link ?? undefined,
      startAt: startAt ? Number(startAt) : undefined,
      endAt: endAt ? Number(endAt) : undefined,
    });

    await database.ref(FirebaseDatabasePath.NEWS).child(id).update(newsUpdates);

    return this.strictGetNews(id);
  }

  async removeNews(newsId: string): Promise<void> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    await database.ref(FirebaseDatabasePath.NEWS).child(newsId).remove();
  }
}
