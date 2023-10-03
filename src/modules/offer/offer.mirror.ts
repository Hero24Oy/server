import { Injectable } from '@nestjs/common';
import { OfferDB } from 'hero24-types';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseMirrorService } from '$modules/firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class OfferMirror extends FirebaseMirrorService<OfferDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.OFFERS));
  }
}
