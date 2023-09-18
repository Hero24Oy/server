import { Injectable } from '@nestjs/common';
import { Database } from 'firebase-admin/database';
import { SellerProfileDB } from 'hero24-types';

import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';

import { SellerProfileCreationArgs } from './dto/creation/seller-profile-creation.args';
import { PartialSellerProfileDataInput } from './dto/editing/partial-seller-profile-data.input';
import { SellerProfileDataEditingArgs } from './dto/editing/seller-profile-data-editing.args';
import { SellerProfileDto } from './dto/seller/seller-profile.dto';
import { SellerProfileDataDto } from './dto/seller/seller-profile-data';
import { SellerProfileListDto } from './dto/sellers/seller-profile-list.dto';
import { SellersArgs } from './dto/sellers/sellers.args';

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

  async getSellers(args: SellersArgs): Promise<SellerProfileListDto> {
    const { offset, limit } = args;

    const sellerProfilesSnapshot = await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .get();

    const sellersRecord: Record<string, SellerProfileDB> =
      sellerProfilesSnapshot.val() ?? {};

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

  async createSeller(
    args: SellerProfileCreationArgs,
  ): Promise<SellerProfileDto | null> {
    const { id, data } = args;

    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(id)
      .child('data')
      .set(SellerProfileDataDto.adapter.toInternal(data));

    return this.getSellerById(id);
  }

  async editSellerData(
    args: SellerProfileDataEditingArgs,
  ): Promise<SellerProfileDto | null> {
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
  ): Promise<boolean> {
    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(sellerId)
      .child('data')
      .child('categories')
      .child(categoryId)
      .set(true);

    return true;
  }

  async unattachCategoryFromSeller(
    sellerId: string,
    categoryId: string,
  ): Promise<boolean> {
    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(sellerId)
      .child('data')
      .child('categories')
      .child(categoryId)
      .remove();

    return true;
  }

  async removeReviewFromSeller(
    sellerId: string,
    reviewId: string,
  ): Promise<boolean> {
    await this.database
      .ref(FirebaseDatabasePath.SELLER_PROFILES)
      .child(sellerId)
      .child('reviews')
      .child(reviewId)
      .remove();

    return true;
  }

  async isSellerApproved(sellerId: string): Promise<boolean> {
    const isApproved = await this.database
      .ref(FirebaseDatabasePath.APPROVED_SELLERS)
      .child(sellerId)
      .get();

    return Boolean(isApproved.val());
  }

  async setIsSellerApproved(
    sellerId: string,
    isApproved: boolean,
  ): Promise<boolean> {
    if (isApproved) {
      await this.database
        .ref(FirebaseDatabasePath.APPROVED_SELLERS)
        .child(sellerId)
        .set(isApproved);
    } else {
      await this.database
        .ref(FirebaseDatabasePath.APPROVED_SELLERS)
        .child(sellerId)
        .remove();
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
