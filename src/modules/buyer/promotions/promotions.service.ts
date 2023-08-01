import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { CreatePromotionInput, PromotionDto } from './dto/promotion.dto';
import { omitUndefined } from 'src/modules/common/common.utils';
import { PromotionDB } from 'hero24-types';
import { PromotionEditingInput } from './dto/promotion-editing.input';

@Injectable()
export class PromotionsService {
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
      (promotion && PromotionDto.convertFromFirebaseType(promotion, id)) || null
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
          PromotionDto.convertFromFirebaseType(
            promotionSnapshot.val(),
            promotionSnapshot.key,
          ),
        );
      }
    });
    return promotions;
  }

  async createPromotion(promotion: CreatePromotionInput): Promise<PromotionDto> {
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
      data: {
        ...newData,
      }
    });

    await database
      .ref('promotions')
      .child(input.id)
      .update(promotionUpdates);

    return this.strictGetPromotion(input.id);
  }

  async deletePromotion(id: string): Promise<void> {
    const app = this.firebaseService.getDefaultApp();
    const database = app.database();

    await database.ref('promotions').child(id).remove();
  }
}
