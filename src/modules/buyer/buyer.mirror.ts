import { Injectable } from '@nestjs/common';
import { CustomerProfile } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class BuyerMirror extends FirebaseMirrorService<CustomerProfile> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.BUYER_PROFILES));
  }
}
