import { Injectable } from '@nestjs/common';
import { CategoryGroupDB } from 'hero24-types';

import { CategoryGroupDto } from './dto/category-group-dto';
import { CategoryGroupsDto } from './dto/category-groups-dto';

import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

@Injectable()
export class CategoryGroupsService {
  private readonly categoryGroupsRef: FirebaseTableReference<CategoryGroupDB>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.categoryGroupsRef = database.ref(FirebaseDatabasePath.FEED);
  }

  async getCategoryList(): Promise<CategoryGroupDto[]> {
    const feedsSnapshot = await this.categoryGroupsRef.get();
    const feeds = feedsSnapshot.val();

    if (!feeds) {
      return [];
    }

    return CategoryGroupsDto.adapter
      .toExternal(feeds)
      .sort((groupA, groupB) => groupA.order - groupB.order);
  }
}
