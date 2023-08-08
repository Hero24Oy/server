import { Injectable } from '@nestjs/common';
import { BuyerProfileDB } from 'hero24-types';

import { getDatabase, ref, set, update } from 'firebase/database';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class BuyerService {
  constructor(private firebaseService: FirebaseService) {}

  async getAllBuyers(): Promise<BuyerProfileDto[]> {
    const database = this.firebaseService.getDefaultApp().database();
    const buyersRef = database.ref(FirebaseDatabasePath.BUYER_PROFILES);

    const buyersSnapshot = await buyersRef.get();
    const buyers: Record<string, BuyerProfileDB> = buyersSnapshot.val() || {};

    return Object.entries(buyers).map(([id, buyerProfile]) =>
      BuyerProfileDto.adapter.toExternal({ id, ...buyerProfile }),
    );
  }

  async getBuyerById(buyerId: string): Promise<BuyerProfileDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const snapshot = await database
      .ref(FirebaseDatabasePath.BUYER_PROFILES)
      .child(buyerId)
      .get();

    const candidate: BuyerProfileDB | null = snapshot.val();

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
}
