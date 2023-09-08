import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { SellerProfileDB } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { PartialSellerProfileDataInput } from './dto/editing/partial-seller-profile-data.input';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfileListDto } from './dto/sellers/seller-profile-list.dto';
import { SellersArgs } from './dto/sellers/sellers.args';
import { FirebaseService } from '../firebase/firebase.service';
import { Database } from 'firebase-admin/database';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { SellerProfileDataDto } from './dto/seller/seller-profile-data';

@Injectable()
export class SellerService {
  database: Database;

  constructor(private readonly firebaseService: FirebaseService) {
    this.database = this.firebaseService.getDefaultApp().database();
  }

  async getSellerById(sellerId: string): Promise<SellerProfileDto | null> {
    const snapshot = await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(sellerId)
      .get();

    const candidate: SellerProfileDB | null = snapshot.val();

    return (
      candidate &&
      SellerProfileDto.adapter.toExternal({ ...candidate, id: sellerId })
    );
  }

  async strictGetSellerById(sellerId: string): Promise<SellerProfileDto> {
    const seller = await this.getSellerById(sellerId);

    if (!seller) {
      throw new Error(`Seller profile with id ${sellerId} was not found`);
    }

    return seller;
  }

  async getAllSellers(): Promise<SellerProfileDto[]> {
    const sellerProfilesSnapshot = await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .get();

    const sellerProfiles: Record<string, SellerProfileDB> =
      sellerProfilesSnapshot.val() || {};

    return Object.entries(sellerProfiles).map(([id, sellerProfile]) =>
      SellerProfileDto.adapter.toExternal({ ...sellerProfile, id }),
    );
  }

  async getSellers(
    args: SellersArgs,
    app: FirebaseAppInstance,
  ): Promise<SellerProfileListDto> {
    const { offset, limit } = args;

    const database = getDatabase(app);

    const sellersSnapshot = await get(
      ref(database, FirebaseDatabasePath.SELLER_PROFILES),
    );

    const sellersRecord: Record<string, SellerProfileDB> =
      sellersSnapshot.val() || {};

    const sellers = Object.entries(sellersRecord).map(([id, sellerProfile]) =>
      SellerProfileDto.adapter.toExternal({ ...sellerProfile, id }),
    );

    let nodes = sellers;

    const total = nodes.length;
    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createSeller(args: SellerProfileCreationArgs) {
    const { id, data } = args;

    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(id)
      .child('data')
      .set(SellerProfileDataDto.adapter.toInternal(data));

    return this.getSellerById(id);
  }

  async editSellerData(args: SellerProfileDataEditingArgs) {
    const { id, data } = args;

    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(id)
      .child('data')
      .update(PartialSellerProfileDataInput.adapter.toInternal(data));

    return this.getSellerById(id);
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

    return Boolean(isApproved.val());
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

  async getSellerByIds(
    sellerIds: readonly string[],
  ): Promise<(SellerProfileDto | null)[]> {
    const sellers = await this.getAllSellers();

    const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));

    return sellerIds.map((sellerId) => sellerById.get(sellerId) || null);
  }
}
