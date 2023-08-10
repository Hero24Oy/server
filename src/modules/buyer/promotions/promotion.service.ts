import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { PromotionDto } from './dto/promotion.dto';
import { omitUndefined } from 'src/modules/common/common.utils';
import { PromotionDB } from 'hero24-types';
import { PromotionEditingInput } from './dto/promotion-editing.input';
import { PromotionCreationInput } from './dto/promotion-creation.input';
import { FirebaseDatabasePath } from 'src/modules/firebase/firebase.constants';

@Injectable()
export class PromotionService {
  constructor(private firebaseService: FirebaseService) {}

  async getPromotion(id: string): Promise<PromotionDto | null> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const promotionSnapshot = await database
      .ref('promotions')
      .child(id)
      .once('value');

    const promotion: PromotionDB | null = promotionSnapshot.val();

    return (
      (promotion && PromotionDto.adapter.toExternal({ ...promotion, id })) ||
      null
    );
  }

  async strictGetPromotion(id: string): Promise<PromotionDto> {
    const promotion = await this.getPromotion(id);

    if (!promotion) {
      throw new Error(`Promotion with id ${id} not found`);
    }

    return promotion;
  }

  async getPromotions(): Promise<PromotionDto[]> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const promotionsSnapshot = await database.ref('promotions').once('value');
    const promotions: PromotionDto[] = [];

    promotionsSnapshot.forEach((promotionSnapshot) => {
      if (promotionSnapshot.key) {
        promotions.push(
          PromotionDto.adapter.toExternal({
            ...promotionSnapshot.val(),
            id: promotionSnapshot.key,
          }),
        );
      }
    });
    return promotions;
  }

  async createPromotion(
    promotion: PromotionCreationInput,
  ): Promise<PromotionDto> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    const { key } = await database.ref('promotions').push(promotion);

    if (!key) {
      throw new Error("Promotion wasn't created");
    }

    return this.strictGetPromotion(key);
  }

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

    const promotionUpdates = omitUndefined<any>({
      ...newData,
    });

    await database
      .ref(FirebaseDatabasePath.PROMOTIONS)
      .child(input.id)
      .child('data')
      .update(promotionUpdates);

    return this.strictGetPromotion(input.id);
  }

  async deletePromotion(id: string): Promise<void> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    await database.ref(FirebaseDatabasePath.PROMOTIONS).child(id).remove();
  }
}
