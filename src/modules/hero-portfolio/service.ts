import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDataDB, HeroPortfolioDB } from 'hero24-types';
import omit from 'lodash/omit';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { defaultSorting } from './constants';
import {
  CreateHeroPortfolioInput,
  EditHeroPortfolioInput,
  HeroPortfolioCreatedSubscription,
  HeroPortfolioDto,
  HeroPortfolioListDto,
  HeroPortfolioListInput,
  HeroPortfolioOrderColumn,
  HeroPortfolioRemovedSubscription,
  RemoveHeroPortfolioInput,
} from './dto';
import {
  GetHeroPortfolioByIdArgs,
  HeroPortfolioListSorterContext,
} from './types';
import { emitHeroPortfolioCreated, emitHeroPortfolioRemoved } from './utils';

import { Identity } from '$modules/auth/auth.types';
import {
  generateId,
  paginate,
  preparePaginatedResult,
} from '$modules/common/common.utils';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';
import { SorterService } from '$modules/sorter/sorter.service';

@Injectable()
export class HeroPortfolioService {
  readonly heroPortfolioTableRef: FirebaseTableReference<
    Record<string, HeroPortfolioDB>
  >;

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
    private readonly heroPortfolioSorter: SorterService<
      HeroPortfolioOrderColumn,
      HeroPortfolioDto,
      HeroPortfolioListSorterContext
    >,
  ) {
    const database = this.firebaseService.getDefaultApp().database();

    this.heroPortfolioTableRef = database.ref(
      FirebaseDatabasePath.HERO_PORTFOLIOS,
    );
  }

  async getHeroPortfolioById(
    args: GetHeroPortfolioByIdArgs,
  ): Promise<HeroPortfolioDto | null> {
    const { sellerId, id: portfolioId } = args;

    const snapshot = await this.heroPortfolioTableRef
      .child(sellerId)
      .child(portfolioId)
      .get();

    const heroPortfolio = snapshot.val();

    return (
      heroPortfolio &&
      HeroPortfolioDto.adapter.toExternal({
        id: portfolioId,
        sellerId,
        ...heroPortfolio.data,
      })
    );
  }

  async strictGetHeroPortfolioById(
    args: GetHeroPortfolioByIdArgs,
  ): Promise<HeroPortfolioDto> {
    const { id } = args;
    const heroPortfolio = await this.getHeroPortfolioById(args);

    if (!heroPortfolio) {
      throw new Error(`Hero portfolio with id ${id} was not found`);
    }

    return heroPortfolio;
  }

  async getPortfolios(
    args: HeroPortfolioListInput,
    identity: Identity,
  ): Promise<HeroPortfolioListDto> {
    const { sellerId, offset, limit, ordersBy } = args;

    const snapshot = await this.heroPortfolioTableRef.child(sellerId).get();
    const heroPortfolios = snapshot.val() ?? {};

    const heroPortfoliosExternal = Object.entries(heroPortfolios).map(
      ([id, item]) =>
        HeroPortfolioDto.adapter.toExternal({ id, sellerId, ...item.data }),
    );

    const sortedHeroPortfoliosExternal = this.heroPortfolioSorter.sort(
      heroPortfoliosExternal,
      ordersBy ?? defaultSorting,
      { identity },
    );

    const total = heroPortfoliosExternal.length;

    const nodes = paginate({
      nodes: sortedHeroPortfoliosExternal,
      limit,
      offset,
    });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createHeroPortfolio(
    input: CreateHeroPortfolioInput,
  ): Promise<HeroPortfolioDto> {
    const dateNow = new Date();
    const { sellerId } = input;
    const id = generateId();

    const heroPortfolio: HeroPortfolioDataDB = omit(
      HeroPortfolioDto.adapter.toInternal({
        ...input,
        id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }),
      ['id', 'sellerId'],
    );

    await this.heroPortfolioTableRef
      .child(sellerId)
      .child(id)
      .set({ data: heroPortfolio });

    return this.strictGetHeroPortfolioById({ sellerId, id });
  }

  async editHeroPortfolio(
    input: EditHeroPortfolioInput,
  ): Promise<HeroPortfolioDto> {
    const { id, sellerId } = input;

    const heroPortfolio = await this.strictGetHeroPortfolioById({
      sellerId,
      id,
    });

    const data = {
      ...omit(
        HeroPortfolioDto.adapter.toInternal({
          ...heroPortfolio,
          ...input,
          updatedAt: new Date(),
        }),
        ['id', 'sellerId'],
      ),
    };

    await this.heroPortfolioTableRef.child(sellerId).child(id).update({ data });

    return this.strictGetHeroPortfolioById({ sellerId, id });
  }

  async removeHeroPortfolio(
    input: RemoveHeroPortfolioInput,
  ): Promise<GetHeroPortfolioByIdArgs> {
    const { id, sellerId } = input;

    await this.heroPortfolioTableRef.child(sellerId).child(id).remove();

    return { id, sellerId };
  }

  emitHeroPortfolioCreation(args: HeroPortfolioCreatedSubscription): void {
    emitHeroPortfolioCreated<HeroPortfolioCreatedSubscription>(
      this.pubSub,
      args,
    );
  }

  emitHeroPortfolioRemoval(args: HeroPortfolioRemovedSubscription): void {
    emitHeroPortfolioRemoved<HeroPortfolioRemovedSubscription>(
      this.pubSub,
      args,
    );
  }
}
