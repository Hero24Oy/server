import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import { HeroPortfolioListArgs } from './dto/hero-portfolio-list/hero-portfolio-list.args';
import { HeroPortfolioListDto } from './dto/hero-portfolio-list/hero-portfolio-list.dto';
import { HeroPortfolioService } from './hero-portfolio.service';

@Resolver()
export class HeroPortfolioResolver {
  constructor(private heroPortfolioService: HeroPortfolioService) {}

  @Query(() => HeroPortfolioListDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async heroPortfolios(
    @Args() args: HeroPortfolioListArgs,
  ): Promise<HeroPortfolioListDto> {
    return this.heroPortfolioService.getPortfolios(args);
  }
}
