import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryAddressesDto } from './category-addresses.dto';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { MaybeType } from 'src/modules/common/common.types';
import { QuestionsDto } from 'src/modules/common/dto/question/question.dto';
import { PackagesDto } from './packages.dto';
import { RecommendedDto } from './recommended.dto';
import { CategorySubscriptionDto } from './category-subscription.dto';

@ObjectType()
export class CategoriesDto {
  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => CategoryAddressesDto)
  addresses: CategoryAddressesDto;

  @Field(() => QuestionsDto)
  questions: QuestionsDto;

  @Field(() => Number)
  defaultCustomerVAT: number;

  @Field(() => Number)
  defaultServiceProviderVAT: number;

  @Field(() => Boolean, { nullable: true })
  isServiceProviderVATLocked: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isConstructionVAT: MaybeType<boolean>;

  @Field(() => Number)
  defaultPrice: number;

  @Field(() => Number)
  minimumPricePerHour: number;

  @Field(() => Number)
  minimumDuration: number;

  @Field(() => Number, { nullable: true })
  netvisorKey: number;

  @Field(() => PackagesDto, { nullable: true })
  packages: MaybeType<PackagesDto>;

  @Field(() => RecommendedDto, { nullable: true })
  recommended: MaybeType<RecommendedDto>;

  @Field(() => CategorySubscriptionDto, { nullable: true })
  subscriptions: MaybeType<CategorySubscriptionDto>;
}