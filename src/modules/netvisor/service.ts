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

    // TODO: We need to inform that netvisor seller info was not created.
    if (netvisorSellerId) {
      await this.userService.setNetvisorSellerId({
        userId: user.id,
        netvisorSellerId: Number(netvisorSellerId),
      });
    }
  }

  async updateNetvisorSellerInfo(seller: SellerProfileDto): Promise<void> {
    const user = await this.userService.strictGetUserById(seller.id);

    // TODO: We need to tell user that netvisorSellerId is undefined.
    if (user.netvisorSellerId) {
      await this.netvisorFetcher.editNetvisorAccount({
        user,
        seller,
        netvisorKey: String(user.netvisorSellerId),
      });
    }
  }
}
