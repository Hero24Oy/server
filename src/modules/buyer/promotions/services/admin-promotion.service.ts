import { Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { omitUndefined } from 'src/modules/common/common.utils';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';

import { PromotionDto } from '../dto/promotion.dto';
import { PromotionEditingInput } from '../dto/promotion-editing.input';
import { PromotionCreationInput } from '../dto/promotion-creation.input';
import { PromotionService } from './promotion.service';

@Injectable()
export class AdminPromotionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly promotionService: PromotionService,
  ) {}

  async createPromotion(
    promotion: PromotionCreationInput,
  ): Promise<PromotionDto> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const { key } = await database.ref('promotions').push(promotion);

    if (!key) {
      throw new Error("Promotion wasn't created");
    }

    return this.promotionService.strictGetPromotion(key);
  }

  // TODO make use of adapters
  async updatePromotion(input: PromotionEditingInput): Promise<PromotionDto> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const newData = omitUndefined({
      categoryId: input.categoryId || undefined,
      discount: input.discount || undefined,
      discountFormat: input.discountFormat || undefined,
      startDate: input.startDate || undefined,
      endDate: input.endDate || undefined,
      description: input.description || undefined,
    });

    await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .child(input.id)
      .child('data')
      .update(newData);

    return this.promotionService.strictGetPromotion(input.id);
  }

  async deletePromotion(id: string): Promise<true> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    await database.ref(FirebaseDatabasePath.PROMOTIONS).child(id).remove();

    return true;
  }
}
