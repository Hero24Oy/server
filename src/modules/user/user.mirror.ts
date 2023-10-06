import { Injectable } from '@nestjs/common';
import { UserDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseMirrorService } from '../firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class UserMirror extends FirebaseMirrorService<UserDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.USERS));
  }
}
