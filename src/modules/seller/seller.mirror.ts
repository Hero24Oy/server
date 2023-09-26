import { Injectable } from '@nestjs/common';
import { SellerProfileDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class SellerMirror extends FirebaseMirrorService<SellerProfileDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.SELLER_PROFILES));
  }
}
