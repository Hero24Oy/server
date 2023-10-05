import { Injectable } from '@nestjs/common';
import { CategoryGroup } from 'hero24-types';

import { CategoryGroupDto } from './dto';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

@Injectable()
export class CategoryGroupService {
  private readonly categoryGroupsRef: FirebaseTableReference<CategoryGroup>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.categoryGroupsRef = database.ref(FirebaseDatabasePath.CATEGORY_GROUP);
  }

  async getCategoryList(): Promise<CategoryGroupDto[]> {
    const feedsSnapshot = await this.categoryGroupsRef.get();
    const feeds = feedsSnapshot.val() ?? {};

    return Object.entries(feeds).map(([id, feed]) => {
      return CategoryGroupDto.adapter.toExternal({
        id,
        ...feed,
      });
    });
  }
}
