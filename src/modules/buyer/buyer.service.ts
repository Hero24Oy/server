import { Injectable } from '@nestjs/common';
import { getDatabase, ref, set, update } from 'firebase/database';
import { BuyerProfileDB, CategoryGroupDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import {
  FirebaseAppInstance,
  FirebaseTableReference,
} from '../firebase/firebase.types';

import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { CategoryGroupDto } from './dto/categoryGroups/category-group-dto';
import { CategoryGroupsDto } from './dto/categoryGroups/category-groups-dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';

@Injectable()
export class BuyerService {
  private readonly buyerTableRef: FirebaseTableReference<BuyerProfileDB>;

  private readonly feedTableRef: FirebaseTableReference<CategoryGroupDB>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.buyerTableRef = database.ref(FirebaseDatabasePath.BUYER_PROFILES);
    this.feedTableRef = database.ref(FirebaseDatabasePath.FEED);
  }

  async getAllBuyers(): Promise<BuyerProfileDto[]> {
    const buyersSnapshot = await this.buyerTableRef.get();
    const buyers = buyersSnapshot.val() || {};

    return Object.entries(buyers).map(([id, buyerProfile]) =>
      BuyerProfileDto.adapter.toExternal({ id, ...buyerProfile }),
    );
  }

  async getBuyerById(buyerId: string): Promise<BuyerProfileDto | null> {
    const snapshot = await this.buyerTableRef.child(buyerId).get();

    const candidate = snapshot.val();

    return (
      candidate &&
      BuyerProfileDto.adapter.toExternal({ id: buyerId, ...candidate })
    );
  }

  async strictGetBuyerProfileById(buyerId: string): Promise<BuyerProfileDto> {
    const buyer = await this.getBuyerById(buyerId);

    if (!buyer) {
      throw new Error(`Buyer with id ${buyerId}`);
    }

    return buyer;
  }

  async createBuyer(
    args: BuyerProfileCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    const { id, data } = args;

    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.BUYER_PROFILES, id, 'data'];

    await set(ref(database, path.join('/')), data);

    return this.strictGetBuyerProfileById(id);
  }

  async editBuyer(
    args: BuyerProfileDataEditingArgs,
    app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    const { id, data } = args;

    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.BUYER_PROFILES, id, 'data'];

    await update(ref(database, path.join('/')), data);

    return this.strictGetBuyerProfileById(id);
  }

  async getBuyerByIds(
    buyerIds: readonly string[],
  ): Promise<Array<BuyerProfileDto | null>> {
    const buyers = await this.getAllBuyers();

    const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));

    return buyerIds.map((buyerId) => buyerById.get(buyerId) || null);
  }

  async listCategories(): Promise<CategoryGroupDto[]> {
    const feedsSnapshot = await this.feedTableRef.get();
    const feeds = feedsSnapshot.val();

    return feeds
      ? CategoryGroupsDto.adapter
          .toExternal(feeds)
          .sort((a, b) => a.data.order - b.data.order)
      : [];
  }
}
