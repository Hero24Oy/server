import { Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { omitUndefined } from 'src/modules/common/common.utils';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';

import { PromotionDto } from '../dto/promotion/promotion.dto';
import { PromotionEditingInput } from '../dto/editing/promotion-editing.input';
import { PromotionCreationInput } from '../dto/creation/promotion-creation.input';
import { PromotionService } from './promotion.service';
import { PromotionDB } from 'hero24-types';

@Injectable()
export class AdminPromotionService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly promotionService: PromotionService,
  ) {}

  async createPromotion(
    promotion: PromotionCreationInput,
  ): Promise<PromotionDto> {
    const database = this.firebaseService.getDefaultApp().database();

    const { key } = await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .push(promotion);

    if (!key) {
      throw new Error("Promotion wasn't created");
    }

    return this.promotionService.strictGetPromotion(key);
  }

  async updatePromotion(input: PromotionEditingInput): Promise<PromotionDto> {
    const database = this.firebaseService.getDefaultApp().database();

    const newData = omitUndefined<Partial<PromotionDB['data']>>({
      categoryId: input.categoryId,
      discount: input.discount,
      discountFormat: input.discountFormat,
      startDate: input.startDate?.getTime(),
      endDate: input.endDate?.getTime(),
      description: input.description,
    });

    await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .child(input.id)
      .child('data')
      .update(newData);

    return this.promotionService.strictGetPromotion(input.id);
  }

  async deletePromotion(id: string): Promise<true> {
    const database = this.firebaseService.getDefaultApp().database();

    await database.ref(FirebaseDatabasePath.PROMOTIONS).child(id).remove();

    return true;
  }
}
