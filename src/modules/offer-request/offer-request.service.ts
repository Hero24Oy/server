import { Injectable } from '@nestjs/common';
import { get, getDatabase, push, ref } from 'firebase/database';
import { OfferRequestDB, OfferRequestSubscription } from 'hero24-types';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDataInput } from './dto/creation/offer-request-data.input';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { isNumber } from 'lodash';
import { omitUndefined } from '../common/common.utils';
import { Identity } from '../auth/auth.types';
import { Scope } from '../auth/auth.constants';

@Injectable()
export class OfferRequestService {
  constructor(private firebaseService: FirebaseService) {}

  private async getAllOfferRequests() {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const offerRequests: OfferRequestDto[] = [];

    const offerRequestsSnapshot = await database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .get();

    offerRequestsSnapshot.forEach((snapshot) => {
      if (snapshot.key) {
        offerRequests.push(
          new OfferRequestDto().fromFirebase({
            ...snapshot.val(),
            id: snapshot.key,
          }),
        );
      }
    });

    return offerRequests;
  }
  async getOfferRequestById(
    offerRequestId: string,
    app: FirebaseAppInstance,
  ): Promise<OfferRequestDto | null> {
    const database = getDatabase(app);

    const path = [FirebaseDatabasePath.OFFER_REQUESTS, offerRequestId];
    const snapshot = await get(ref(database, path.join('/')));

    const offerRequest: OfferRequestDB | null = snapshot.val();

    if (!offerRequest) {
      return null;
    }

    return new OfferRequestDto().fromFirebase({
      ...offerRequest,
      id: offerRequestId,
    });
  }

  /**
   * @description Give access to own offer requests for user and all offer requests for admin
   */
  async getOfferRequestList(
    args: OfferRequestListArgs,
    identity: Identity,
  ): Promise<OfferRequestListDto> {
    const { limit, offset } = args;

    const offerRequests = await this.getAllOfferRequests();
    const hasPagination = isNumber(limit) && isNumber(offset);

    let edges = offerRequests;

    if (identity.scope === Scope.USER) {
      edges = edges.filter(
        ({ data }) => data.initial.buyerProfile === identity.id,
      );
    }

    const total = edges.length;

    if (hasPagination) {
      edges = edges.slice(offset, offset + limit);
    }

    return {
      total,
      edges: edges.map((node) => ({ node, cursor: node.id })),
      endCursor: edges[edges.length - 1]?.id,
      hasNextPage: hasPagination ? offset + limit < total : false,
    };
  }

  async createOfferRequest(
    args: OfferRequestCreationArgs,
    app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    const {
      data,
      subscription,
      serviceProviderVAT,
      customerVat,
      minimumDuration,
    } = args;

    const database = getDatabase(app);

    const offerRequest: Omit<OfferRequestDB, 'subscription'> & {
      subscription?: Pick<OfferRequestSubscription, 'subscriptionType'>;
    } = omitUndefined({
      data: new OfferRequestDataInput(data).toFirebase(),
      customerVAT: customerVat ?? undefined,
      subscription: subscription ?? undefined,
      serviceProviderVAT: serviceProviderVAT ?? undefined,
      minimumDuration: minimumDuration ?? undefined,
    });

    if (offerRequest.data.initial.questions.length === 0) {
      throw new Error('OfferRequest questions can not be empty array');
    }

    const offerRequestRef = ref(database, FirebaseDatabasePath.OFFER_REQUESTS);

    const createdRef = await push(offerRequestRef, offerRequest);

    return this.getOfferRequestById(
      createdRef.key as string,
      app,
    ) as Promise<OfferRequestDto>;
  }
}
