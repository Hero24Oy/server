import moment from 'moment';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { FirebaseAppInstance } from 'src/modules/firebase/firebase.types';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

import { OfferChangeInput } from '../dto/editing/offer-change.input';
import { OfferCompletedInput } from '../dto/editing/offer-completed.input';
import { OfferExtendInput } from '../dto/editing/offer-extend.input';
import { OfferStatus } from '../dto/offer/offer-status.enum';
import { WorkTimeDto } from '../dto/offer/work-time.dto';
import { UpdatedDateDB } from '../types';
import { CommonOfferService } from './common-offer.service';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferInput } from '../dto/creation/offer.input';
import { hydrateOffer } from '../offer.utils/prepopulate-offer.util';
import { AcceptanceGuardInput } from '../dto/creation/acceptance-guard.input';
import { getChangedQuestions } from '../offer.utils/get-changes';

@Injectable()
export class SellerOfferService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly commonOfferService: CommonOfferService,
    private readonly offerRequestService: OfferRequestService,
  ) {}

  async markOfferAsSeenBySeller(offerId: string): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    await offerRef.child('data').child('seenBySeller').set(true);

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
    { reasonToExtend, timeToExtend }: OfferExtendInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    await offerRef.update({
      timeToExtend,
      reasonToExtend,
    });

    return true;
  }

  async markJobCompleted(
    offerId: string,
    { actualStartTime, actualCompletedTime, workTime }: OfferCompletedInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);

    // mark status completed
    await this.commonOfferService.updateOfferStatus(offerId, {
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

    offerRef.child('data').child('workTime').set(workTimeConverted);

    return true;
  }

  async declineOfferChanges(offerId: string): Promise<boolean> {
    await this.commonOfferService.updateOfferStatus(offerId, {
      status: OfferStatus.CANCELLED,
    });

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
    const offer = await this.commonOfferService.strictGetOfferById(offerId);

    const isOfferPaused = offer.data.isPaused;

    const updatedDate: UpdatedDateDB = {
      isPaused: !isOfferPaused,
      workTime:
        // because of casting number type to date, extra step is need, as in db we store date as number
        offer.data.workTime?.map(
          WorkTimeDto.adapter.toInternal.bind(WorkTimeDto),
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
    { agreedStartTime }: OfferChangeInput,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const isAcceptTimeChanges = agreedStartTime;
    const isAcceptDetailsChanges = !isAcceptTimeChanges;

    const offerRef = database.ref(FirebaseDatabasePath.OFFERS).child(offerId);
    const offer = await this.commonOfferService.strictGetOfferById(offerId);

    const offerRequestRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offer.data.initial.offerRequestId);
    const offerRequestSnapshot = await offerRequestRef.once('value');
    const offerRequest: OfferRequestDB = offerRequestSnapshot.val();

    if (!offerRequest.data.requestedChanges) {
      throw new Error('OfferRequest does not have requested changes!');
    }

    const {
      requestedChanges: { changedQuestions },
      initial: { questions },
    } = offerRequest.data;
    const { dateQuestion, otherChanges } = getChangedQuestions(
      changedQuestions,
      questions,
    );

    if (isAcceptTimeChanges && dateQuestion) {
      await offerRef
        .child('data')
        .child('initial')
        .child('agreedStartTime')
        .set(agreedStartTime.getTime());
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

  async createAcceptanceGuard({
    offerRequestId,
    sellerProfileId,
  }: AcceptanceGuardInput): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();

    const guard = database
      .ref(FirebaseDatabasePath.OFFER_REQUEST_ACCEPTANCE_GUARDS)
      .child(offerRequestId);

    await new Promise<void>((resolve, reject) => {
      guard.transaction(
        (sellerId: string | null) => {
          if (sellerId === null) {
            return sellerProfileId;
          }
        },
        (error, committed) => {
          if (error) {
            reject(error);
          } else if (!committed) {
            reject(new Error(`OfferRequest has been accepted`));
          }

          resolve();
        },
      );
    });

    return true;
  }

  async createOffer(offer: OfferInput): Promise<OfferDto> {
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

    await createdOfferRef.set(OfferDto.adapter.toInternal(offerHydrated));

    return offerHydrated;
  }

  async declineOfferRequest(
    offerRequestId: string,
    sellerId: string,
    app: FirebaseAppInstance,
  ): Promise<boolean> {
    const database = this.firebaseService.getDefaultApp().database();
    const offerRequest = await this.offerRequestService.getOfferRequestById(
      offerRequestId,
      app,
    );

    if (!offerRequest) {
      throw new Error('Offer request is not found');
    }

    if (
      !offerRequest.data.pickServiceProvider?.preferred ||
      !offerRequest.data.pickServiceProvider.preferred.includes(sellerId)
    ) {
      throw new NotFoundException('Given user is not in the preferred list');
    }

    const updatedPreferredMap: Record<string, boolean | null> = {
      ...convertListToFirebaseMap(
        offerRequest.data.pickServiceProvider.preferred,
      ),
      [sellerId]: null,
    };

    const preferredRef = database
      .ref(FirebaseDatabasePath.OFFER_REQUESTS)
      .child(offerRequestId)
      .child('data')
      .child('pickServiceProvider')
      .child('preferred');

    await preferredRef.update(updatedPreferredMap);

    return true;
  }
}
