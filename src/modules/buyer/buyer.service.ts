import { Injectable } from '@nestjs/common';
import { getDatabase, ref, set, update } from 'firebase/database';
import { BuyerProfileDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import {
  FirebaseAppInstance,
  FirebaseTableReference,
} from '../firebase/firebase.types';

import { BuyerMirror } from './buyer.mirror';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';

import { UserService } from '$modules/user/user.service';

@Injectable()
export class BuyerService {
  private readonly buyerTableRef: FirebaseTableReference<BuyerProfileDB>;

  constructor(
    private readonly buyerMirror: BuyerMirror,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {
    const database = this.firebaseService.getDefaultApp().database();

    this.buyerTableRef = database.ref(FirebaseDatabasePath.BUYER_PROFILES);
  }

  async getAllBuyers(): Promise<BuyerProfileDto[]> {
    return this.buyerMirror
      .getAll()
      .map(([id, buyerProfile]) =>
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

    const buyerProfile = await this.strictGetBuyerProfileById(id);

    await this.userService.setHasProfile(id, 'hasBuyerProfile', true);

    return buyerProfile;
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

  async deleteBuyer(id: string): Promise<boolean> {
    await this.buyerTableRef.child(id).remove();

    await this.userService.setHasProfile(id, 'hasBuyerProfile', false);

    return true;
  }
}
