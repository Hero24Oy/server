import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryAddressesDto } from './category-addresses.dto';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { MaybeType } from 'src/modules/common/common.types';
import {
  QuestionDto,
  QuestionDtoConvertor,
} from 'src/modules/common/dto/question/question.dto';
import { RecommendedDto } from './recommended.dto';
import { PackageDto } from 'src/modules/common/dto/package/package.dto';
import { CategoryDB, CategoryDBAddresses } from 'hero24-types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { convertListToObjects } from 'src/modules/common/common.utils/convert-list-to-objects.util';
import { CategorySubscriptionDto } from './category-subscription.dto';

@ObjectType()
export class CategoryDto {
  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => CategoryAddressesDto)
  addresses: CategoryAddressesDto;

  @Field(() => [QuestionDto])
  questions: QuestionDto[];

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
  netvisorKey?: number;

  @Field(() => [PackageDto], { nullable: true })
  packages?: PackageDto[];

  @Field(() => [RecommendedDto], { nullable: true })
  recommended?: RecommendedDto[];

  @Field(() => [CategorySubscriptionDto], { nullable: true })
  subscriptions?: CategorySubscriptionDto[];

  static adapter: FirebaseAdapter<CategoryDB & { id: string }, CategoryDto>;
}

CategoryDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => {
    let questions: QuestionDto[] = [];
    for (const id in internal.questions) {
      questions.push(
        QuestionDtoConvertor.convertFromFirebaseType(
          internal.questions[id],
          id,
        ),
      );
    }
    let packages: PackageDto[] = [];
    for (const id in internal.packages) {
      packages.push(
        PackageDto.convertFromFirebaseType(internal.packages[id], id),
      );
    }
    let recommended: RecommendedDto[] = [];
    for (const id in internal.recommended) {
      recommended.push(
        RecommendedDto.convertFromFirebaseType(internal.recommended[id], id),
      );
    }
    let subscriptions: CategorySubscriptionDto[] = [];
    for (const id in internal.subscriptions) {
      subscriptions.push(
        CategorySubscriptionDto.convertFromFirebaseType(
          internal.subscriptions[id],
          id,
        ),
      );
    }
    return {
      id: internal.id,
      name: internal.name,
      addresses: internal.addresses as CategoryAddressesDto,
      questions: questions,
      defaultCustomerVAT: internal.defaultCustomerVAT,
      defaultServiceProviderVAT: internal.defaultServiceProviderVAT,
      isServiceProviderVATLocked: internal.isServiceProviderVATLocked,
      isConstructionVAT: internal.isConstructionVAT,
      defaultPrice: internal.defaultPrice,
      minimumPricePerHour: internal.minimumPricePerHour,
      minimumDuration: internal.minimumDuration,
      netvisorKey: internal.netvisorKey,
      packages: packages,
      recommended: recommended,
      subscriptions: subscriptions,
    };
  },
  toInternal: (external) => ({
    id: '',
    name: external.name,
    addresses: external.addresses as CategoryDBAddresses,
    questions: convertListToObjects(external.questions),
    defaultCustomerVAT: external.defaultCustomerVAT,
    defaultServiceProviderVAT: external.defaultServiceProviderVAT,
    isServiceProviderVATLocked:
      external.isServiceProviderVATLocked || undefined,
    isConstructionVAT: external.isConstructionVAT || undefined,
    defaultPrice: external.defaultPrice,
    minimumPricePerHour: external.minimumPricePerHour,
    minimumDuration: external.minimumDuration,
    netvisorKey: external.netvisorKey,
    packages: convertListToObjects(external.packages) || undefined,
    recommended: convertListToObjects(external.recommended),
    subscriptions: convertListToObjects(external.subscriptions),
  }),
});
