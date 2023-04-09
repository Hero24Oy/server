import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref } from 'firebase/database';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
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
}
