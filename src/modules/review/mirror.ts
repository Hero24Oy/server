import { Injectable } from '@nestjs/common';
import { ReviewDB } from 'hero24-types';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseMirrorService } from '$modules/firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class ReviewMirror extends FirebaseMirrorService<ReviewDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.REVIEWS));
  }
}
