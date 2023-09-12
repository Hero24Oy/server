import { Field, ObjectType } from '@nestjs/graphql';
import { NewsDB } from 'hero24-types';

import { MaybeType } from '$/src/modules/common/common.types';

@ObjectType()
export class NewsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  label: string;

  @Field(() => Date)
  startAt: Date;

  @Field(() => Date)
  endAt: Date;

  @Field(() => String, { nullable: true })
  link: MaybeType<string>;

  static convertFromFirebaseType(news: NewsDB, id: string): NewsDto {
    return {
      id,
      title: news.title,
      description: news.description,
      label: news.label,
      startAt: new Date(news.startAt),
      endAt: new Date(news.endAt),
      link: news.link,
    };
  }
}
