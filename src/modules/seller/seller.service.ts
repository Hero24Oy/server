import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { SellerProfileDB } from 'hero24-types';

import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import {
  FirebaseAppInstance,
  FirebaseTableReference,
} from '../firebase/firebase.types';

import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { PartialSellerProfileDataInput } from './dto/editing/partial-seller-profile-data.input';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfileDataDto } from './dto/seller/seller-profile-data';
import { SellerProfileListDto } from './dto/sellers/seller-profile-list.dto';
import { SellersArgs } from './dto/sellers/sellers.args';
import { SellerMirror } from './seller.mirror';

import { NetvisorService } from '$modules/netvisor';
import { UserService } from '$modules/user/user.service';

@Injectable()
export class SellerService {
  sellerTableRef: FirebaseTableReference<SellerProfileDB>;

  constructor(
    firebaseService: FirebaseService,
    private readonly sellerMirror: SellerMirror,
    private readonly userService: UserService,
    private readonly netvisorService: NetvisorService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.sellerTableRef = database.ref(FirebaseDatabasePath.SELLER_PROFILES);
  }

  async getSellerById(sellerId: string): Promise<SellerProfileDto | null> {
    const snapshot = await this.sellerTableRef.child(sellerId).get();

    const candidate = snapshot.val();

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
    return this.sellerMirror
      .getAll()

      .map(([id, sellerProfile]) =>
        SellerProfileDto.adapter.toExternal({ ...sellerProfile, id }),
      );
  }

  async getSellers(args: SellersArgs): Promise<SellerProfileListDto> {
    const { offset, limit } = args;

    let nodes = await this.getAllSellers();

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

    await this.sellerTableRef
      .child(id)
      .child('data')
      .set(SellerProfileDataDto.adapter.toInternal(data));

    await this.userService.setHasSellerProfile({
      id,
      hasProfile: true,
    });

    const seller = await this.strictGetSellerById(id);

    await this.netvisorService.createNetvisorSellerInfo(seller);

    return this.strictGetSellerById(id);
  }

  async editSellerData(args: SellerProfileDataEditingArgs) {
    const { id, data } = args;

    await this.sellerTableRef
      .child(id)
      .child('data')
      .update(PartialSellerProfileDataInput.adapter.toInternal(data));

    const updatedSeller = await this.strictGetSellerById(id);

    await this.netvisorService.updateNetvisorSellerInfo(updatedSeller);

    return updatedSeller;
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
