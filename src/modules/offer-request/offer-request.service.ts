import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { AddressesAnswered, OfferRequestDB } from 'hero24-types';
import get from 'lodash/get';
import isString from 'lodash/isString';
import map from 'lodash/map';

import { Scope } from '../auth/auth.constants';
import { Identity } from '../auth/auth.types';
import {
  omitUndefined,
  paginate,
  preparePaginatedResult,
} from '../common/common.utils';
import { FiltererService } from '../filterer/filterer.service';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { OfferRole } from '../offer/dto/offer/offer-role.enum';
import { SorterService } from '../sorter/sorter.service';

import { AddressesAnsweredInput } from './dto/address-answered/addresses-answered.input';
import { OfferRequestCreationInput } from './dto/creation/offer-request-creation.input';
import { OfferRequestDataInput } from './dto/creation/offer-request-data.input';
import { OfferRequestUpdateAddressesInput } from './dto/editing/offer-request-update-addresses.input';
import { OfferRequestUpdateQuestionsInput } from './dto/editing/offer-request-update-questions.input';
import { UpdateAcceptedChangesInput } from './dto/editing/update-accepted-changes.input';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestListArgs } from './dto/offer-request-list/offer-request-list.args';
import { OfferRequestListDto } from './dto/offer-request-list/offer-request-list.dto';
import { OfferRequestOrderColumn } from './dto/offer-request-list/offer-request-order-column';
import { OfferRequestPurchaseInput } from './dto/offer-request-purchase/offer-request-purchase.input';
import { OfferRequestFilterColumn } from './offer-request.constants';
import { OfferRequestFiltererConfigs } from './offer-request.filers';
import {
  OfferRequestFiltererContext,
  OfferRequestSorterContext,
  PaidStatus,
} from './offer-request.types';
import { emitOfferRequestUpdated } from './offer-request.utils/emit-offer-request-updated.util';
import { OfferRequestQuestionInput } from './offer-request-question/dto/offer-request-question/offer-request-question.input';
import { OfferRequestQuestionType } from './offer-request-question/dto/offer-request-question/offer-request-question-type.enum';
import {} from './offer-request-question/offer-request-question.constants';
import { PlainOfferRequestQuestion } from './offer-request-question/offer-request-question.types';
import { offerRequestQuestionsToTree } from './offer-request-question/offer-request-question.utils/offer-request-questions-to-tree.util';
import { OfferRequestStatus } from './open-offer-request/dto/offer-request-status.enum';

@Injectable()
export class OfferRequestService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly sorterService: SorterService<
      OfferRequestOrderColumn,
      OfferRequestDto,
      OfferRequestSorterContext
    >,
    private readonly filtererService: FiltererService<
      OfferRequestFilterColumn,
      OfferRequestDto,
      OfferRequestFiltererContext,
      OfferRequestFiltererConfigs
    >,
    @Inject(PUBSUB_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  get offerRequestTableRef(): FirebaseTableReference<OfferRequestDB> {
    const database = this.firebaseService.getDefaultApp().database();

    return database.ref(FirebaseDatabasePath.OFFER_REQUESTS);
  }

  private async getAllOfferRequests(): Promise<OfferRequestDto[]> {
    const offerRequestsSnapshot = await this.offerRequestTableRef.get();
    const offerRequests = offerRequestsSnapshot.val() || {};

    return Object.entries(offerRequests)
      .map(([id, offerRequest]) => ({ id, ...offerRequest }))
      .map(OfferRequestDto.adapter.toExternal);
  }

  async getOfferRequestById(id: string): Promise<OfferRequestDto | null> {
    const offerRequestRef = this.offerRequestTableRef.child(id);

    const snapshot = await offerRequestRef.get();

    const offerRequest = snapshot.val();

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
    const { limit, offset, orderBy, filter, role } = args;

    const offerRequests = await this.getAllOfferRequests();

    let nodes = offerRequests;

    if (identity.scope === Scope.USER) {
      nodes = nodes.filter(({ data }) => {
        if (role === OfferRole.SELLER) {
          return data.initial.buyerProfile !== identity.id;
        }

        return data.initial.buyerProfile === identity.id;
      });
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
    const { data, serviceProviderVAT, customerVat, minimumDuration } = input;

    const offerRequest: OfferRequestDB = omitUndefined({
      data: OfferRequestDataInput.adapter.toInternal(data),
      customerVAT: customerVat ?? undefined,
      serviceProviderVAT: serviceProviderVAT ?? undefined,
      minimumDuration: minimumDuration ?? undefined,
    });

    if (offerRequest.data.initial.questions.length === 0) {
      throw new Error('OfferRequest questions can not be empty array');
    }

    const createdRef = await this.offerRequestTableRef.push(offerRequest);

    if (!createdRef.key) {
      throw new Error("Offer request could't be created");
    }

    return this.strictGetOfferRequestById(createdRef.key);
  }

  async getCategoryIdByOfferRequestId(
    offerRequestId: string,
  ): Promise<string | null> {
    const categorySnapshot = await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('category')
      .get();

    return categorySnapshot.val();
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
    const buyerIdSnapshot = await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('buyerProfile')
      .get();

    return buyerIdSnapshot.val();
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
    const feesSnapshot = await this.offerRequestTableRef
      .child(offerRequestId)
      .child('fees')
      .get();

    const fees = feesSnapshot.val() || {};

    return Object.keys(fees);
  }

  async updatePurchase(purchase: OfferRequestPurchaseInput): Promise<true> {
    const { id } = purchase;

    const updatedInitial =
      OfferRequestPurchaseInput.adapter.toInternal(purchase);

    try {
      await this.offerRequestTableRef
        .child(id)
        .child('data')
        .child('initial')
        .update(updatedInitial);
    } catch {
      throw new Error('Purchase update failed');
    }

    return true;
  }

  async markOfferRequestReviewed(offerRequestId: string): Promise<boolean> {
    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('reviewed')
      .set(true);

    return true;
  }

  async cancelOfferRequest(offerRequestId: string): Promise<boolean> {
    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('status')
      .set(OfferRequestStatus.CANCELLED);

    return true;
  }

  async updateOfferRequestAddresses(
    input: OfferRequestUpdateAddressesInput,
  ): Promise<OfferRequestDto> {
    const { offerRequestId, addresses: inputAddresses } = input;

    const addresses = AddressesAnsweredInput.adapter.toInternal(
      inputAddresses,
    ) as AddressesAnswered;

    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('addresses')
      .set(addresses);

    return this.strictGetOfferRequestById(offerRequestId);
  }

  async updateOfferRequestQuestions(
    input: OfferRequestUpdateQuestionsInput,
  ): Promise<OfferRequestDto> {
    const { offerRequestId, questions: inputQuestions } = input;

    const plainQuestions = inputQuestions.map(
      OfferRequestQuestionInput.adapter.toInternal,
    ) as PlainOfferRequestQuestion[];

    const questions = offerRequestQuestionsToTree(plainQuestions);

    const offerRequest = await this.strictGetOfferRequestById(offerRequestId);

    const firebaseOfferRequest =
      OfferRequestDto.adapter.toInternal(offerRequest);

    const oldQuestions = get(firebaseOfferRequest, [
      'data',
      'initial',
      'questions',
    ]);

    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('requestedChanges')
      .set({
        created: Date.now(),
        changedQuestions: {
          before: oldQuestions,
          after: questions,
        },
      });

    return this.strictGetOfferRequestById(offerRequestId);
  }

  async updateDateQuestionWithAgreedStartTime(
    offerRequestId: string,
    agreedStartTime: Date,
  ): Promise<void> {
    const offerRequest = await this.strictGetOfferRequestById(offerRequestId);

    const initialQuestions = get(
      OfferRequestDto.adapter.toInternal(offerRequest),
      ['data', 'initial', 'questions'],
    );

    const questions = map(initialQuestions, (question) => {
      if (question.type === OfferRequestQuestionType.DATE) {
        return {
          ...question,
          preferredTime: agreedStartTime.getTime(),
          suitableTimes: null,
          suitableTimesCount: null,
        };
      }

      return question;
    });

    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('questions')
      .set(questions);
  }

  async updateAcceptedChanges(
    input: UpdateAcceptedChangesInput,
  ): Promise<OfferRequestDto> {
    const { offerRequestId, timeChangeAccepted, detailsChangeAccepted } = input;

    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('changesAccepted')
      .update({ timeChangeAccepted, detailsChangeAccepted });

    return this.strictGetOfferRequestById(offerRequestId);
  }

  async updatePaidStatus(
    offerRequestId: string,
    status: PaidStatus,
  ): Promise<OfferRequestDto> {
    await this.offerRequestTableRef
      .child(offerRequestId)
      .child('data')
      .child('initial')
      .child('prepaid')
      .set(status);

    return this.strictGetOfferRequestById(offerRequestId);
  }

  emitOfferRequestUpdated(offerRequest: OfferRequestDto): void {
    emitOfferRequestUpdated(this.pubSub, offerRequest);
  }
}
