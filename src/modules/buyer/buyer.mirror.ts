import { Injectable } from '@nestjs/common';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

import { CustomerProfileDB } from './customer.types';

@Injectable()
export class BuyerMirror extends FirebaseMirrorService<CustomerProfileDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.BUYER_PROFILES));
  }
}
