import { Field, ObjectType } from '@nestjs/graphql';
import { HeroPortfolioDB } from 'hero24-types';

import { HeroPortfolioDataDto } from './hero-portfolio-data.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class HeroPortfolioDto {
  @Field(() => [HeroPortfolioDataDto])
  data: HeroPortfolioDataDto[];

  static adapter: FirebaseAdapter<
    Record<string, HeroPortfolioDB>,
    Record<'data', HeroPortfolioDataDto[]>
  >;
}

HeroPortfolioDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    data: Object.entries(internal).map(([id, item]) =>
      HeroPortfolioDataDto.adapter.toExternal({ id, ...item.data }),
    ),
  }),
  toInternal: (external) =>
    Object.fromEntries(
      external.data.map((item) => [
        item.id,
        { data: HeroPortfolioDataDto.adapter.toInternal(item) },
      ]),
    ),
});
