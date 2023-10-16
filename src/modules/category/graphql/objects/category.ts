import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CategoryDB, CategoryDBAddresses, QuestionDB } from 'hero24-types';

import { CategoryAddressObject } from './category-address';
import { CategorySubscriptionObject } from './category-subscription';
import { QuestionObject, QuestionObjectAdapter } from './questions';
import { RecommendedObject } from './recommended';

import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { WithId } from '$modules/common/common.types/with-id';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import { PackageDto } from '$modules/offer-request/dto/offer-request/package.dto';

@ObjectType()
export class CategoryObject {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => CategoryAddressObject)
  addresses: CategoryAddressObject;

  @Field(() => Float)
  defaultCustomerVAT: number;

  @Field(() => Float)
  defaultServiceProviderVAT: number;

  @Field(() => Boolean, { nullable: true })
  isServiceProviderVATLocked?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isConstructionVAT?: MaybeType<boolean>;

  @Field(() => Float)
  defaultPrice: number;

  @Field(() => Float)
  minimumPricePerHour: number;

  @Field(() => Float)
  minimumDuration: number;

  @Field(() => Float, { nullable: true })
  netvisorKey?: MaybeType<number>;

  @Field(() => [QuestionObject])
  questions: QuestionObject[];

  @Field(() => [PackageDto], { nullable: true })
  packages?: PackageDto[];

  @Field(() => [RecommendedObject], { nullable: true })
  recommended?: RecommendedObject[];

  @Field(() => [CategorySubscriptionObject], { nullable: true })
  subscriptions?: CategorySubscriptionObject[];

  static adapter: FirebaseAdapter<WithId<CategoryDB>, CategoryObject>;
}

CategoryObject.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    name: internal.name,
    addresses: internal.addresses,
    defaultCustomerVAT: internal.defaultCustomerVAT,
    isServiceProviderVATLocked: internal.isServiceProviderVATLocked,
    isConstructionVAT: internal.isConstructionVAT,
    defaultServiceProviderVAT: internal.defaultServiceProviderVAT,
    defaultPrice: internal.defaultPrice,
    minimumPricePerHour: internal.minimumPricePerHour,
    minimumDuration: internal.minimumDuration,
    netvisorKey: internal.netvisorKey,
    questions: Object.entries(internal.questions ?? {}).map(
      ([id, question]) => {
        return QuestionObjectAdapter.toExternal({
          ...question,
          id,
        } as PlainQuestion);
      },
    ),
    packages: Object.entries(internal.packages ?? {}).map(([id, packageDb]) => {
      return PackageDto.adapter.toExternal({ ...packageDb, id });
    }),
    recommended: Object.entries(internal.recommended ?? {}).map(
      ([id, recommended]) => {
        return RecommendedObject.adapter.toExternal({ ...recommended, id });
      },
    ),
    subscriptions: Object.entries(internal.subscriptions ?? {}).map(
      ([id, subscription]) => {
        return CategorySubscriptionObject.adapter.toExternal({
          ...subscription,
          id,
        });
      },
    ),
  }),
  toInternal: (external) => ({
    id: external.id,
    name: external.name,
    addresses: external.addresses as CategoryDBAddresses,
    defaultCustomerVAT: external.defaultCustomerVAT,
    isServiceProviderVATLocked:
      external.isServiceProviderVATLocked ?? undefined,
    isConstructionVAT: external.isConstructionVAT ?? undefined,
    defaultServiceProviderVAT: external.defaultServiceProviderVAT,
    defaultPrice: external.defaultPrice,
    minimumPricePerHour: external.minimumPricePerHour,
    minimumDuration: external.minimumDuration,
    netvisorKey: external.netvisorKey ?? undefined,
    questions: Object.fromEntries(
      external.questions.map((question) => {
        return [
          question.id,
          QuestionObjectAdapter.toInternal(question) as QuestionDB,
        ];
      }),
    ),
    packages: external.packages
      ? Object.fromEntries(
          external.packages.map((packageDto) => {
            return [packageDto.id, PackageDto.adapter.toInternal(packageDto)];
          }),
        )
      : undefined,
    recommended: external.recommended
      ? Object.fromEntries(
          external.recommended.map((recommended) => {
            return [
              recommended.id,
              RecommendedObject.adapter.toInternal(recommended),
            ];
          }),
        )
      : undefined,
    subscriptions: external.subscriptions
      ? Object.fromEntries(
          external.subscriptions.map((subscription) => {
            return [
              subscription.id,
              CategorySubscriptionObject.adapter.toInternal(subscription),
            ];
          }),
        )
      : undefined,
  }),
});
