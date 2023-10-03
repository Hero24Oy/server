import { Injectable } from '@nestjs/common';
import { FeeDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class FeeMirror extends FirebaseMirrorService<FeeDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.FEES));
  }
}
