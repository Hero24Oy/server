import { Field, ObjectType } from '@nestjs/graphql';
import { HeroPortfolioDB } from 'hero24-types';

import { HeroPortfolioDataDto } from './hero-portfolio-data.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class HeroPortfolioDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  heroProfileId: string;

  @Field(() => HeroPortfolioDataDto)
  data: HeroPortfolioDataDto;

  static adapter: FirebaseAdapter<
    HeroPortfolioDB & { heroProfileId: string; id: string },
    HeroPortfolioDto
  >;
}

HeroPortfolioDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    heroProfileId: internal.heroProfileId,
    data: HeroPortfolioDataDto.adapter.toExternal(internal.data),
  }),
  toInternal: (external) => ({
    id: external.id,
    heroProfileId: external.heroProfileId,
    data: HeroPortfolioDataDto.adapter.toInternal(external.data),
  }),
});
