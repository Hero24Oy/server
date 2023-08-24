import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';
import { CategoryDto } from './dto/category.dto';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';

@Injectable()
export class CategoryService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  async getAllCategories() {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const categories: CategoryDto[] = [];

    const categoriesSnapshot = await database
      .ref(FirebaseDatabasePath.CATEGORIES)
      .get();

    categoriesSnapshot.forEach((snapshot) => {
      if (snapshot.key) {
        categories.push(
          CategoryDto.adapter.toExternal({
            ...snapshot.val(),
            id: snapshot.key,
          }),
        );
      }
    });

    return categories;
  }
}
