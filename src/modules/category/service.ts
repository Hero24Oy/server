import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

import { CategoryObject, GetCategoriesOutput } from './graphql';

import { FirebaseTableReference } from '$modules/firebase/firebase.types';

@Injectable()
export class CategoryService {
  readonly categoriesTableRef: FirebaseTableReference<CategoryDB>;

  constructor(firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.categoriesTableRef = database.ref(FirebaseDatabasePath.CATEGORIES);
  }

  async getAllCategories(): Promise<GetCategoriesOutput[]> {
    const categoriesSnapshot = await this.categoriesTableRef.get();

    const categories = categoriesSnapshot.val() ?? {};

    return Object.entries(categories).map(([id, category]) => {
      return {
        category: CategoryObject.adapter.toExternal({ id, ...category }),
      };
    });
  }
}
