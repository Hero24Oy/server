import { Injectable } from '@nestjs/common';
import { BuyerProfileDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

import { CustomerType } from './dto/buyer/buyer-profile-data.dto';

@Injectable()
export class BuyerMirror extends FirebaseMirrorService<
  BuyerProfileDB & { data: { type: CustomerType } }
> {
  // TODO remove after hero24-types updated
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.BUYER_PROFILES));
  }
}
