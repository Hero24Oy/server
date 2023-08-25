import { isString } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { OfferRequestDB, OfferRequestSubscription } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { OfferRequestCreationInput } from './dto/creation/offer-request-creation.input';
import { OfferRequestDataInput } from './dto/creation/offer-request-data.input';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { OfferRequestPurchaseInput } from './dto/offer-request-purchase/offer-request-purchase.input';
import { FirebaseService } from '../firebase/firebase.service';
import {
  omitUndefined,
  paginate,
  preparePaginatedResult,
} from '../common/common.utils';
import { Identity } from '../auth/auth.types';
import { Scope } from '../auth/auth.constants';
import { SorterService } from '../sorter/sorter.service';
import { OfferRequestOrderColumn } from './dto/offer-request-list/offer-request-order-column';
import {
  OfferRequestFiltererContext,
  OfferRequestSorterContext,
} from './offer-request.types';
import { FiltererService } from '../filterer/filterer.service';
import {
  OfferRequestFilterColumn,
  OfferRequestStatus,
} from './offer-request.constants';
import { OfferRequestFiltererConfigs } from './offer-request.filers';
import { emitOfferRequestUpdated } from './offer-request.utils/emit-offer-request-updated.util';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { PubSub } from 'graphql-subscriptions';
import { OfferRequestUpdateAddressInput } from './dto/editing/offer-request-update-address.input';
import { AddressesAnsweredInput } from './dto/address-answered/addresses-answered.input';

@Injectable()
export class OfferRequestService {
  constructor(
    private firebaseService: FirebaseService,
    private sorterService: SorterService<
      OfferRequestOrderColumn,
      OfferRequestDto,
      OfferRequestSorterContext
    >,
    private filtererService: FiltererService<
      OfferRequestFilterColumn,
      OfferRequestDto,
      OfferRequestFiltererContext,
      OfferRequestFiltererConfigs
    >,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  private getOfferRequestsRef() {
    const database = this.firebaseService.getDefaultApp().database();

    return database.ref(FirebaseDatabasePath.OFFER_REQUESTS);
  }

  private async getAllOfferRequests() {
    const offerRequests: OfferRequestDto[] = [];

    const offerRequestsSnapshot = await this.getOfferRequestsRef().get();

    offerRequestsSnapshot.forEach((snapshot) => {
      if (snapshot.key) {
        offerRequests.push(
          OfferRequestDto.adapter.toExternal({
            ...snapshot.val(),
            id: snapshot.key,
          }),
        );
      }
    });

    return offerRequests;
  }
  async getOfferRequestById(id: string): Promise<OfferRequestDto | null> {
    const offerRequestRef = this.getOfferRequestsRef().child(id);

    const snapshot = await offerRequestRef.get();

    const offerRequest: OfferRequestDB | null = snapshot.val();

    if (!offerRequest) {
      return null;
    }

    return OfferRequestDto.adapter.toExternal({ ...offerRequest, id });
  }

  async strictGetOfferRequestById(id: string): Promise<OfferRequestDto> {
    const offerRequest = await this.getOfferRequestById(id);

    if (!offerRequest) {
      throw new Error(`Offer request is not found by id ${id}`);
    }

    return offerRequest;
  }

  /**
   * @description Give access to own offer requests for user and all offer requests for admin
   */
  async getOfferRequestList(
    args: OfferRequestListArgs,
    identity: Identity,
  ): Promise<OfferRequestListDto> {
    const { limit, offset, orderBy, filter } = args;

    const offerRequests = await this.getAllOfferRequests();

    let nodes = offerRequests;

    if (identity.scope === Scope.USER) {
      nodes = nodes.filter(
        ({ data }) => data.initial.buyerProfile === identity.id,
      );
    }

    const filtererConfig: Partial<OfferRequestFiltererConfigs> = {
      [OfferRequestFilterColumn.STATUS]: filter?.status || undefined,
    };

    nodes = this.filtererService.filter(nodes, filtererConfig, {});
    nodes = this.sorterService.sort(nodes, orderBy || [], {});

    const total = nodes.length;
    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      limit,
      offset,
      total,
    });
  }

  async createOfferRequest(
    input: OfferRequestCreationInput,
  ): Promise<OfferRequestDto> {
    const {
      data,
      subscription,
      serviceProviderVAT,
      customerVat,
      minimumDuration,
    } = input;

    const offerRequest: Omit<OfferRequestDB, 'subscription'> & {
      subscription?: Pick<OfferRequestSubscription, 'subscriptionType'>;
    } = omitUndefined({
      data: OfferRequestDataInput.adapter.toInternal(data),
      customerVAT: customerVat ?? undefined,
      subscription: subscription ?? undefined,
      serviceProviderVAT: serviceProviderVAT ?? undefined,
      minimumDuration: minimumDuration ?? undefined,
    });

    if (offerRequest.data.initial.questions.length === 0) {
      throw new Error('OfferRequest questions can not be empty array');
    }

    const createdRef = await this.getOfferRequestsRef().push(offerRequest);

    if (!createdRef.key) {
      throw new Error("Offer request could't be created");
    }

    return this.strictGetOfferRequestById(createdRef.key);
  }

  async getCategoryIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string | null> {
    const categorySnapshot = await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('category')
      .get();

    const category: string | null = categorySnapshot.val();

    return category;
  }

  async strictGetCategoryIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string> {
    const category = await this.getCategoryIdByOfferRequestId(offerRequestId);

    if (!isString(category)) {
      throw new Error(
        `Category was not found for offer request with id ${offerRequestId}`,
      );
    }

    return category;
  }

  async getBuyerIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string | null> {
    const buyerIdSnapshot = await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('buyerProfile')
      .get();

    const buyerId: string | null = buyerIdSnapshot.val();

    return buyerId;
  }

  async strictGetBuyerIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string> {
    const buyerId = await this.getBuyerIdByOfferRequestId(offerRequestId);

    if (!buyerId) {
      throw new Error(
        `Buyer id was not found for offer request ${offerRequestId}`,
      );
    }

    return buyerId;
  }

  async getFeeIdsByOfferRequestId(offerRequestId: string): Promise<string[]> {
    const feesSnapshot = await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('fees')
      .get();

    const fees: Record<string, true> | null = feesSnapshot.val();

    return Object.keys(fees || {});
  }

  async updatePurchase(purchase: OfferRequestPurchaseInput): Promise<true> {
    const { id, fixedPrice, fixedDuration } = purchase;

    try {
      await this.getOfferRequestsRef()
        .child(id)
        .child('data')
        .child('initial')
        .update({ fixedPrice, fixedDuration });
    } catch {
      throw new Error('Purchase update failed');
    }

    return true;
  }

  async markOfferRequestReviewed(offerRequestId: string): Promise<boolean> {
    await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('data')
      .child('reviewed')
      .set(true);

    return true;
  }

  async cancelOfferRequest(offerRequestId: string): Promise<boolean> {
    await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('data')
      .child('status')
      .set(OfferRequestStatus.CANCELLED);

    return true;
  }

  async updateOfferRequestAddress(
    input: OfferRequestUpdateAddressInput,
  ): Promise<void> {
    const { offerRequestId, addresses: inputAddresses } = input;

    const addresses = AddressesAnsweredInput.adapter.toInternal(inputAddresses);

    await this.getOfferRequestsRef()
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('addresses')
      .set(addresses);
  }

  async emitOfferRequestUpdated(id: string) {
    const offerRequest = await this.strictGetOfferRequestById(id);

    emitOfferRequestUpdated(this.pubSub, offerRequest);
  }
}
