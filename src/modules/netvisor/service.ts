import { Injectable } from '@nestjs/common';

import { NetvisorFetcher } from './fetcher';

import { SellerProfileDto } from '$modules/seller/dto/seller/seller-profile.dto';
import { UserService } from '$modules/user/user.service';

@Injectable()
export class NetvisorService {
  constructor(
    private readonly netvisorFetcher: NetvisorFetcher,
    private readonly userService: UserService,
  ) {}

  async createNetvisorSellerInfo(seller: SellerProfileDto): Promise<void> {
    const user = await this.userService.strictGetUserById(seller.id);

    const netvisorSellerId = await this.netvisorFetcher.createNetvisorAccount({
      seller,
      user,
    });

    if (!netvisorSellerId) {
      throw new Error(`Could not create netvisor seller id for ${seller.id}`);
    }

    await this.userService.setNetvisorSellerId({
      userId: user.id,
      netvisorSellerId: Number(netvisorSellerId),
    });
  }

  async updateNetvisorSellerInfo(seller: SellerProfileDto): Promise<void> {
    const user = await this.userService.strictGetUserById(seller.id);

    if (!user.netvisorSellerId) {
      throw new Error(
        `Could not update seller ${seller.id} without netvisor seller id!`,
      );
    }

    if (user.netvisorSellerId) {
      await this.netvisorFetcher.editNetvisorAccount({
        user,
        seller,
        netvisorKey: String(user.netvisorSellerId),
      });
    }
  }
}
