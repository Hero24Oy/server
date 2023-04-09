import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref, set, update } from 'firebase/database';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { BuyerProfileDto } from './dto/buyer/buyer-profile.dto';
import { BuyerProfileCreationArgs } from './dto/creation/buyer-profile-creation.args';
import { BuyerProfileDataEditingArgs } from './dto/editing/buyer-profile-data-editing.args';

@Injectable()
export class BuyerService {
  async getBuyerById(
    buyerId: string,
    app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto | null> {
    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.BUYER_PROFILES, buyerId];

    const snapshot = await get(ref(database, path.join('/')));

    const candidate = snapshot.val();

    return (
      candidate && BuyerProfileDto.convertFromFirebaseType(candidate, buyerId)
    );
  }

  async createBuyer(
    args: BuyerProfileCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    const { id, data } = args;

    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.BUYER_PROFILES, id, 'data'];
    await set(ref(database, path.join('/')), data);

    return this.getBuyerById(id, app) as Promise<BuyerProfileDto>;
  }

  async editBuyer(
    args: BuyerProfileDataEditingArgs,
    app: FirebaseAppInstance,
  ): Promise<BuyerProfileDto> {
    const { id, data } = args;

    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.BUYER_PROFILES, id, 'data'];
    await update(ref(database, path.join('/')), data);

    return this.getBuyerById(id, app) as Promise<BuyerProfileDto>;
  }
}
