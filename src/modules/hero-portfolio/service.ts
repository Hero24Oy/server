import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { HeroPortfolioDataDB, HeroPortfolioDB } from 'hero24-types';
import omit from 'lodash/omit';
import { v4 as uuidV4 } from 'uuid';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { defaultSorting } from './constants';
import {
  CreateHeroPortfolioInput,
  CreateHeroPortfolioOutput,
  EditHeroPortfolioInput,
  EditHeroPortfolioOutput,
  HeroPortfolio,
  HeroPortfolioListInput,
  HeroPortfolioListOutput,
  HeroPortfolioOrderColumn,
  RemoveHeroPortfolioInput,
  RemoveHeroPortfolioOutput,
  SubscribeOnHeroPortfolioRemoveOutput,
  SubscribeOnHeroPortfoliosCreateOutput,
} from './graphql';
import {
  GetHeroPortfolioByIdArgs,
  HeroPortfolioListSorterContext,
} from './types';
import { emitHeroPortfolioCreated, emitHeroPortfolioRemoved } from './utils';

import { Identity } from '$modules/auth/auth.types';
import { paginate, preparePaginatedResult } from '$modules/common/common.utils';
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
      HeroPortfolio,
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
  ): Promise<HeroPortfolio | null> {
    const { sellerId, id: portfolioId } = args;

    const snapshot = await this.heroPortfolioTableRef
      .child(sellerId)
      .child(portfolioId)
      .get();

    const heroPortfolio = snapshot.val();

    return (
      heroPortfolio &&
      HeroPortfolio.adapter.toExternal({
        id: portfolioId,
        sellerId,
        ...heroPortfolio.data,
      })
    );
  }

  async strictGetHeroPortfolioById(
    args: GetHeroPortfolioByIdArgs,
  ): Promise<HeroPortfolio> {
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
  ): Promise<HeroPortfolioListOutput> {
    const { sellerId, offset, limit, ordersBy } = args;

    const snapshot = await this.heroPortfolioTableRef.child(sellerId).get();
    const heroPortfolios = snapshot.val() ?? {};

    const heroPortfoliosExternal = Object.entries(heroPortfolios).map(
      ([id, item]) =>
        HeroPortfolio.adapter.toExternal({ id, sellerId, ...item.data }),
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
    identity: Identity,
  ): Promise<CreateHeroPortfolioOutput> {
    const dateNow = new Date();
    const { id: sellerId } = identity;
    const id = uuidV4();

    const heroPortfolio: HeroPortfolioDataDB = omit(
      HeroPortfolio.adapter.toInternal({
        ...input,
        id,
        sellerId,
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
    identity: Identity,
  ): Promise<EditHeroPortfolioOutput> {
    const { id } = input;
    const { id: sellerId } = identity;

    const heroPortfolio = await this.strictGetHeroPortfolioById({
      sellerId,
      id,
    });

    const data = {
      ...omit(
        HeroPortfolio.adapter.toInternal({
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
    identity: Identity,
  ): Promise<RemoveHeroPortfolioOutput> {
    const { id } = input;
    const { id: sellerId } = identity;

    const heroPortfolio = await this.strictGetHeroPortfolioById({
      sellerId,
      id,
    });

    await this.heroPortfolioTableRef.child(sellerId).child(id).remove();

    return heroPortfolio;
  }

  emitHeroPortfolioCreation(args: SubscribeOnHeroPortfoliosCreateOutput): void {
    emitHeroPortfolioCreated<SubscribeOnHeroPortfoliosCreateOutput>(
      this.pubSub,
      args,
    );
  }

  emitHeroPortfolioRemoval(args: SubscribeOnHeroPortfolioRemoveOutput): void {
    emitHeroPortfolioRemoved<SubscribeOnHeroPortfolioRemoveOutput>(
      this.pubSub,
      args,
    );
  }
}
