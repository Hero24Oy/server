import { Inject, Injectable } from '@nestjs/common';

import { ref, getDatabase, get } from 'firebase/database';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

@Injectable()
export class CategoriesService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}
  
  
}
