import { Injectable } from '@nestjs/common';
import { ChatDB } from 'hero24-types';

import { FirebaseDatabasePath } from '../../firebase/firebase.constants';
import { FirebaseService } from '../../firebase/firebase.service';
import { FirebaseMirrorService } from '../../firebase/firebase-mirror/firebase-mirror.interface';

@Injectable()
export class ChatMirror extends FirebaseMirrorService<ChatDB> {
  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    super(database.ref(FirebaseDatabasePath.CHATS));
  }
}
