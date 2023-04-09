import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref, remove, set, update } from 'firebase/database';
import { SellerProfileDB } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { SellerProfileDataInput } from './dto/creation/seller-profile-data.input';
import { PartialSellerProfileDataInput } from './dto/editing/partial-seller-profile-data.input';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfilesDto } from './dto/sellers/seller-profiles.dto';
import { SellersArgs } from './dto/sellers/sellers.args';

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

  async getSellers(
    args: SellersArgs,
    app: FirebaseAppInstance,
  ): Promise<SellerProfilesDto> {
    const { offset, limit } = args;

    const database = getDatabase(app);

    const sellersSnapshot = await get(
      ref(database, FirebaseDatabasePath.SELLER_PROFILES),
    );

    const sellersRecord: Record<string, SellerProfileDB> =
      sellersSnapshot.val() || {};

    const sellers = Object.entries(sellersRecord).map(([id, sellerProfile]) =>
      SellerProfileDto.convertFromFirebaseType(sellerProfile, id),
    );

    const total = sellers.length;

    if (typeof offset === 'number' && typeof limit === 'number') {
      const edges = sellers
        .slice(offset, limit)
        .map((node) => ({ node, cursor: node.id }));

      return {
        edges,
        total,
        hasNextPage: total > offset + limit,
        endCursor: edges[edges.length - 1]?.cursor || null,
      };
    }

    return {
      edges: sellers.map((node) => ({ node, cursor: node.id })),
      total,
      hasNextPage: false,
      endCursor: sellers[sellers.length - 1]?.id || null,
    };
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

  async attachCategoryToSeller(
    sellerId: string,
    categoryId: string,
    app: FirebaseAppInstance,
  ) {
    const database = getDatabase(app);

    const path = [
      FirebaseDatabasePath.SELLER_PROFILES,
      sellerId,
      'data',
      'categories',
      categoryId,
    ];

    await set(ref(database, path.join('/')), true);

    return true;
  }

  async unattachCategoryFromSeller(
    sellerId: string,
    categoryId: string,
    app: FirebaseAppInstance,
  ) {
    const database = getDatabase(app);

    const path = [
      FirebaseDatabasePath.SELLER_PROFILES,
      sellerId,
      'data',
      'categories',
      categoryId,
    ];

    await remove(ref(database, path.join('/')));

    return true;
  }

  async removeReviewFromSeller(
    sellerId: string,
    reviewId: string,
    app: FirebaseAppInstance,
  ) {
    const database = getDatabase(app);

    const path = [
      FirebaseDatabasePath.SELLER_PROFILES,
      sellerId,
      'reviews',
      reviewId,
    ];

    await remove(ref(database, path.join('/')));

    return true;
  }

  async isSellerApproved(
    sellerId: string,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.APPROVED_SELLERS, sellerId];
    const isApproved = await get(ref(database, path.join('/')));

    return !!isApproved.val();
  }

  async setIsSellerApproved(
    sellerId: string,
    isApproved: boolean,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.APPROVED_SELLERS, sellerId];

    if (isApproved) {
      await set(ref(database, path.join('/')), isApproved);
    } else {
      await remove(ref(database, path.join('/')));
    }

    return true;
  }
}
