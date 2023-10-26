import { Injectable, Logger } from '@nestjs/common';
import { PaidStatus } from 'hero24-types';

import { NetvisorFetcher } from './fetcher';
import { GetOffersByInvoiceIdsFrom } from './types';
import { getPreviousDay } from './utils';

import { OfferRequestService } from '$modules/offer-request/offer-request.service';
import { SellerProfileDto } from '$modules/seller/dto/seller/seller-profile.dto';
import { UserService } from '$modules/user/user.service';

@Injectable()
export class NetvisorService {
  private readonly logger = new Logger(NetvisorService.name);

  constructor(
    private readonly netvisorFetcher: NetvisorFetcher,
    private readonly userService: UserService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  async updateOfferRequestPaidStatus(
    getOffersByInvoiceIds: GetOffersByInvoiceIdsFrom,
    fromDate?: string,
  ): Promise<void> {
    try {
      const startDate = fromDate ?? getPreviousDay();

      const paidInvoices = await this.netvisorFetcher.fetchPurchaseInvoiceList(
        startDate,
      );

      if (!paidInvoices) {
        return;
      }

      const offers = await getOffersByInvoiceIds(paidInvoices);

      const promises = offers.map(async (offer) => {
        try {
          const { offerRequestId } = offer.data.initial;

          await this.offerRequestService.updatePaidStatus(
            offerRequestId,
            PaidStatus.PAID,
          );
        } catch (error) {
          this.logger.error(error);
          this.logger.debug(offer);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }

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
