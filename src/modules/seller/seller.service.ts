import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref, set, update } from 'firebase/database';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataInput } from './dto/creation/seller-profile-data.input';
import { PartialSellerProfileDataInput } from './dto/editing/partial-seller-profile-data.input';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';

@Injectable()
export class SellerService {
  async getSellerById(
    sellerId: string,
    app: FirebaseAppInstance,
  ): Promise<SellerProfileDto | null> {
    const database = getDatabase(app);
    const path = [FirebaseDatabasePath.SELLER_PROFILES, sellerId];

    const snapshot = await get(ref(database, path.join('/')));

    const candidate = snapshot.val();

    return (
      candidate && SellerProfileDto.convertFromFirebaseType(candidate, sellerId)
    );
  }

  async createSeller(
    args: SellerProfileCreationArgs,
    app: FirebaseAppInstance,
  ) {
    const { id, data } = args;

    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.SELLER_PROFILES, id];

    await set(ref(database, path.join('/')), {
      data: SellerProfileDataInput.converToFirebaseType(data),
    });

    return this.getSellerById(id, app);
  }

  async editSellerData(
    args: SellerProfileDataEditingArgs,
    app: FirebaseAppInstance,
  ) {
    const { id, data } = args;

    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.SELLER_PROFILES, id, 'data'];

    await update(
      ref(database, path.join('/')),
      PartialSellerProfileDataInput.converToFirebaseType(data),
    );

    return this.getSellerById(id, app);
  }
}
