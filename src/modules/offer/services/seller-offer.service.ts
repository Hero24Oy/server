import { Injectable } from '@nestjs/common';

import { AcceptanceGuardInput } from '../dto/creation/acceptance-guard.input';
import { OfferInput } from '../dto/creation/offer.input';
import { OfferChangeInput } from '../dto/editing/offer-change.input';
import { OfferCompletedInput } from '../dto/editing/offer-completed.input';
import { OfferExtendInput } from '../dto/editing/offer-extend.input';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferStatus } from '../dto/offer/offer-status.enum';
import { WorkTimeDto } from '../dto/offer/work-time.dto';
import { getChangedQuestions } from '../offer.utils/get-changes.util';
import { hydrateOffer } from '../offer.utils/hydrate-offer.util';
import { unpauseJob } from '../offer.utils/unpause-job.uitl';
import { UpdatedDateDB, UpdatedDateGraphql } from '../types';

import { OfferService } from './offer.service';

import { get, omit } from '$imports/lodash';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class SellerOfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  async markOfferAsSeenBySeller(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('data')
      .child('seenBySeller')
      .set(true);

    return true;
  }

  async cancelRequestToExtend(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    await database.ref(FirebaseDatabasePath.OFFERS).child(offerId).update({
      timeToExtend: null,
      reasonToExtend: null,
    });

    return true;
  }

  async extendOfferDuration({
    reasonToExtend,
    timeToExtend,
    offerId,
  }: OfferExtendInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    await database.ref(FirebaseDatabasePath.OFFERS).child(offerId).update({
      timeToExtend,
      reasonToExtend,
    });

    return true;
  }

  async markJobCompleted({
    actualStartTime,
    actualCompletedTime,
    workTime,
    offerId,
  }: OfferCompletedInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    // mark status completed
    await this.offerService.updateOfferStatus({
      offerId,
      status: OfferStatus.COMPLETED,
    });
    await offerRef.child('data').update({
      actualStartTime: actualStartTime.getTime(),
      actualCompletedTime: actualCompletedTime.getTime(),
      isPaused: false,
    });

    const workTimeConverted = workTime.map((time) =>
      WorkTimeDto.adapter.toInternal(time),
    );

    void offerRef.child('data').child('workTime').set(workTimeConverted);

    return true;
  }

  async declineOfferChanges(offerId: string): Promise<boolean> {
    await this.offerService.updateOfferStatus({
      offerId,
      status: OfferStatus.CANCELLED,
    });

    return true;
  }

  async startJob(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const timestamp = Date.now();

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('data')
      .update({
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

    const offer = await this.offerService.strictGetOfferById(offerId);

    // on startJob workTime should be initialized
    if (!offer.data.workTime) {
      throw new Error('WorkTime is undefined');
    }

    const isJobPaused = offer.data.isPaused;

    const updatedDate: UpdatedDateGraphql = {
      isPaused: !isJobPaused,
      workTime: offer.data.workTime,
      pauseDurationMS: offer.data.pauseDurationMS || 0,
    };

    if (!isJobPaused) {
      updatedDate.workTime[updatedDate.workTime.length - 1].endTime =
        new Date();
    } else {
      const { pauseDurationMS, workTime } = unpauseJob(offer);

      updatedDate.pauseDurationMS = pauseDurationMS;
      updatedDate.workTime.push(workTime);
    }

    const updatedDateConverted: UpdatedDateDB = {
      isPaused: updatedDate.isPaused,
      pauseDurationMS: updatedDate.pauseDurationMS,
      workTime: updatedDate.workTime.map((time) =>
        WorkTimeDto.adapter.toInternal(time),
      ),
    };

    await database
      .ref(FirebaseDatabasePath.OFFERS)
      .child(offerId)
      .child('data')
      .update(updatedDateConverted);

    return true;
  }

  async acceptOfferChanges({
    agreedStartTime,
    offerId,
  }: OfferChangeInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const isAcceptDetailsChanges = !agreedStartTime;
    const isAcceptTimeChanges = !isAcceptDetailsChanges;

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.offerService.strictGetOfferById(offerId);
    const offerRequestId = get(offer, ['data', 'initial', 'offerRequestId']);

    const offerRequest =
      await this.offerRequestService.strictGetOfferRequestById(offerRequestId);

    if (!offerRequest.data.requestedChanges) {
      throw new Error('OfferRequest does not have requested changes!');
    }

    const {
      requestedChanges: { changedQuestions },
      initial: { questions },
    } = offerRequest.data;

    const { isDateChanges, isOtherChanges } = getChangedQuestions(
      changedQuestions,
      questions,
    );

    if (isAcceptTimeChanges && isDateChanges) {
      await offerRef
        .child('data')
        .child('initial')
        .child('agreedStartTime')
        .set(agreedStartTime.getTime());
    }

    const isTimeChangeAccepted = !isDateChanges || isAcceptTimeChanges;
    const isDetailsChangeAccepted = !isOtherChanges || isAcceptDetailsChanges;

    await this.offerRequestService.updateAcceptedChanges({
      offerRequestId,
      detailsChangeAccepted: isDetailsChangeAccepted,
      timeChangeAccepted: isTimeChangeAccepted,
    });

    if (isDetailsChangeAccepted && isTimeChangeAccepted) {
      await offerRef.child('data').child('requestedChangesAccepted').set(true);
    }

    return true;
  }

  async createAcceptanceGuard({
    offerRequestId,
    sellerProfileId,
  }: AcceptanceGuardInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const guard = database
      .ref(FirebaseDatabasePath.OFFER_REQUEST_ACCEPTANCE_GUARDS)
      .child(offerRequestId);

    await new Promise<void>((resolve, reject) => {
      void guard.transaction(
        (sellerId: string | null) => {
          if (sellerId === null) {
            return sellerProfileId;
          }
        },
        (error, committed) => {
          if (error) {
            reject(error);
          } else if (!committed) {
            reject(new Error('OfferRequest has been accepted'));
          }

          resolve();
        },
      );
    });

    return true;
  }

  async createOffer(offer: OfferInput): Promise<OfferDto> {
    await this.createAcceptanceGuard(offer.data.initial);

    const database = this.firebaseService.getDefaultApp().database();

    const createdOfferRef = await database
      .ref(FirebaseDatabasePath.OFFERS)
      .push();

    if (!createdOfferRef.key) {
      throw new Error('Could not create offer');
    }

    const offerHydrated = hydrateOffer(offer, {
      id: createdOfferRef.key,
    });

    const offerWithoutId = omit(
      OfferDto.adapter.toInternal(offerHydrated),
      'id',
    );

    await createdOfferRef.set(offerWithoutId);

    return offerHydrated;
  }
}
