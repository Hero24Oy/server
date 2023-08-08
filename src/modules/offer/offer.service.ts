import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { OfferDB, OfferRequestDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { WorkTimeDto } from './dto/offer/work-time.dto';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { OfferExtendInput } from './dto/editing/offer-extend.input';
import { OFFER_UPDATED_SUBSCRIPTION } from './offer.constants';
import { OfferCompletedInput } from './dto/editing/offer-completed.input';
import { OfferStatusInput } from './dto/editing/offer-status.input';
import { UpdatedDateDB } from './types';
import { OfferChangeInput } from './dto/editing/offer-change.input';
import { differenceWith, isEqual } from 'lodash';
import { isDateQuestion } from './offer.utils/is-date-quesiton.util';
import { filterOffers } from './offer.utils/filter-offers.util';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { OfferDto } from './dto/offer/offer.dto';
import { OfferArgs } from './dto/offers/offers.args';
import { OfferStatus } from './dto/offer/offer-status.enum';
import { SorterService } from '../sorter/sorter.service';
import { OfferOrderColumn } from './dto/offers/offers-order.enum';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { OfferListDto } from './dto/offers/offer-list.dto';

@Injectable()
export class OfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private offerSorter: SorterService<OfferOrderColumn, OfferDto, null>,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async offerUpdated(offer: OfferDto): Promise<void> {
    return this.pubSub.publish(OFFER_UPDATED_SUBSCRIPTION, {
      [OFFER_UPDATED_SUBSCRIPTION]: offer,
    });
  }

  async getOfferById(offerId: string): Promise<OfferDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const snapshot = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .get();

    const offer: OfferDB | null = snapshot.val();

    return offer && OfferDto.adapter.toExternal({ id: offerId, ...offer });
  }

  async strictGetOfferById(offerId: string): Promise<OfferDto> {
    const offer = await this.getOfferById(offerId);

    if (!offer) {
      throw new Error(`Offer with id ${offerId} was not found`);
    }

    return offer;
  }

  async setHubSpotDealId(offerId: string, dealId: string | null) {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('hubSpotDealId')
      .set(dealId);
  }

  async markOfferAsSeenByBuyer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('buyerData').child('seenByBuyer').set(true);

    return true;
  }

  async markOfferAsSeenBySeller(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('data').child('seenBySeller').set(true);

    return true;
  }

  async declineExtendOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('timeToExtend').set(0);

    return true;
  }

  async approveCompletedOffer(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.strictGetOfferById(offerId);

    if (!offer || offer.status !== 'completed') {
      throw new Error(`Offer must be completed to approve`);
    }

    await offerRef.child('isApproved').set(true);

    return true;
  }

  async cancelRequestToExtend(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.update({
      timeToExtend: null,
      reasonToExtend: null,
    });

    return true;
  }

  async extendOfferDuration(
    offerId: string,
    args: OfferExtendInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.update({
      timeToExtend: args.extendedDuration,
      reasonToExtend: args.reasonToExtend,
    });

    return true;
  }

  async markJobCompleted(
    offerId: string,
    args: OfferCompletedInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    // mark status completed
    await this.updateOfferStatus(offerId, { status: OfferStatus.COMPLETED });
    await offerRef.child('data').update({
      actualStartTime: args.actualStartTime,
      actualCompletedTime: args.actualCompletedTime,
      isPaused: false,
    });
    offerRef.child('data').child('workTime').set(args.workTime);

    return true;
  }

  async declineOfferChanges(offerId: string): Promise<boolean> {
    await this.updateOfferStatus(offerId, { status: OfferStatus.CANCELLED });

    return true;
  }

  async updateOfferStatus(
    offerId: string,
    input: OfferStatusInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('status').set(input.status);

    return true;
  }

  async startJob(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerDataRef = database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('data');

    const timestamp = Date.now();

    await offerDataRef.update({
      actualStartTime: timestamp,
      isPaused: false,
      workTime: [
        {
          startTime: timestamp,
          endTime: null,
        },
      ],
    });

    return true;
  }

  async toggleJobStatus(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();
    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.strictGetOfferById(offerId);
    const isOfferPaused = offer.data.isPaused;

    const updatedDate: UpdatedDateDB = {
      isPaused: !isOfferPaused,
      workTime:
        // because of casting number type to date, extra step is need, as in db we store date as number
        offer.data.workTime?.map(
          WorkTimeDto.adapter.toInternal.bind(WorkTimeDto), // this context is lost, so bind it
        ) || [],
    };

    if (!isOfferPaused) {
      updatedDate.workTime[updatedDate.workTime.length - 1].endTime =
        Date.now();
    } else {
      const time =
        updatedDate.workTime[updatedDate.workTime.length - 1].endTime;

      const startTime = typeof time === 'number' ? moment(time) : moment();
      const endTime = moment();

      const pauseDuration = endTime.diff(startTime, 'milliseconds');

      updatedDate.pauseDurationMS = offer.data.pauseDurationMS
        ? pauseDuration + offer.data.pauseDurationMS
        : pauseDuration;

      updatedDate.workTime.push({
        startTime: Date.now(),
      });
    }

    await offerRef.child('data').update(updatedDate);

    return true;
  }

  async acceptOfferChanges(
    offerId: string,
    input: OfferChangeInput,
  ): Promise<boolean> {
    console.log('chanigng');
    const database = this.firebaseService.getDefaultApp().database();
    const { agreedStartTime } = input;

    const isAcceptTimeChanges = typeof agreedStartTime === 'number';
    const isAcceptDetailsChanges = !isAcceptTimeChanges;

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    const offer = await this.strictGetOfferById(offerId);

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offer.data.initial.offerRequestId);

    const offerRequestSnapshot = await offerRequestRef.once('value');

    const offerRequest: OfferRequestDB = offerRequestSnapshot.val();

    const {
      requestedChanges,
      initial: { questions },
    } = offerRequest.data;

    if (!requestedChanges) {
      throw new Error('OfferRequest does not have requestedChanges!');
    }

    const {
      changedQuestions: { after },
    } = requestedChanges;

    const differences = differenceWith(after, questions, isEqual);

    const dateQuestion = differences.find(isDateQuestion);
    const otherChanges = differences.filter(
      (question) => !isDateQuestion(question),
    );

    if (isAcceptTimeChanges && dateQuestion) {
      await offerRef
        .child('data')
        .child('initial')
        .child('agreedStartTime')
        .set(agreedStartTime);
    }

    const changesAccepted = {
      detailsChangeAccepted: isAcceptDetailsChanges || !otherChanges.length,
      timeChangeAccepted: isAcceptTimeChanges || !dateQuestion,
    };

    await offerRequestRef
      .child('data')
      .child('changesAccepted')
      .update(changesAccepted);

    if (
      changesAccepted.detailsChangeAccepted &&
      changesAccepted.timeChangeAccepted
    ) {
      await offerRef.child('data').child('requestedChangesAccepted').set(true);
    }

    return true;
  }

  async approvePrepaidOffer(
    offerId: string,
    offerRequestId: string,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.strictGetOfferById(offerId);

    const agreedStartTime = offer.data.initial.agreedStartTime;

    if (!agreedStartTime) {
      throw new Error('Could not find offered time! (should never happen)');
    }

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId);

    const offerRequest = await offerRequestRef.once('value');

    if (!offerRequest.exists()) {
      throw new Error('OfferRequest not found! (should never happen)');
    }

    const offerRequestValues: OfferRequestDB = await offerRequest.val();
    const updatedQuestions: OfferRequestDB['data']['initial']['questions'] =
      offerRequestValues.data.initial.questions.map((question) => {
        if (question.type === 'date') {
          question.preferredTime = agreedStartTime.getTime();
          question.suitableTimes = null;
          question.suitableTimesCount = null;
        }
        return question;
      });

    await offerRequestRef
      .child('data')
      .child('initial')
      .child('questions')
      .set(updatedQuestions);

    await offerRef.child('status').set(OfferStatus.ACCEPTED);

    return true;
  }

  async getOffers(args: OfferArgs): Promise<OfferListDto> {
    const database = this.firebaseService.getDefaultApp().database();
    const { limit, filter, offset, ordersBy = [] } = args;

    const offersSnapshot = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .once('value');

    let nodes: OfferDto[] = [];

    offersSnapshot.forEach((snapshot) => {
      if (!snapshot.key) {
        return;
      }

      const offer: OfferDB = snapshot.val();
      nodes.push(OfferDto.adapter.toExternal({ ...offer, id: snapshot.key }));
    });

    nodes = filterOffers({ offers: nodes, filter });
    nodes = this.offerSorter.sort(nodes, ordersBy, null);

    const total = nodes.length;
    nodes = paginate({ nodes, limit, offset });

    return preparePaginatedResult({
      nodes,
      total,
      limit,
      offset,
    });
  }
}
