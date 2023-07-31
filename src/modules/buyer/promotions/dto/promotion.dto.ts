import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { PromotionDB } from 'hero24-types';

@ObjectType()
export class PromotionDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => Number)
  discount: number;

  @Field(() => String)
  discountFormat: 'fixed' | 'percentage';

  @Field(() => Number)
  startDate: number;

  @Field(() => Number)
  endDate: number;

  @Field(() => String)
  description: string;

  static convertFromFirebaseType(
    promotion: PromotionDB,
    id: string,
  ): PromotionDto {
    return {
      id: id,
      categoryId: promotion.data.categoryId,
      discount: promotion.data.discount,
      discountFormat: promotion.data.discountFormat,
      startDate: promotion.data.startDate,
      endDate: promotion.data.endDate,
      description: promotion.data.description,
    };
  }
}

@InputType()
export class CreatePromotionInput {
  @Field()
  categoryId: string;

  @Field()
  discount: number;

  @Field()
  discountFormat: 'fixed' | 'percentage';

  @Field()
  startDate: number;

  @Field()
  endDate: number;

  @Field()
  description: string;
}
