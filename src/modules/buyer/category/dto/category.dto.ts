import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryAddressesDto } from './category-addresses.dto';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import {
  QuestionAdapter,
  QuestionDto,
} from 'src/modules/common/dto/question/question.dto';
import { RecommendedDto } from './recommended.dto';
import { PackageDto } from 'src/modules/common/dto/package/package.dto';
import { CategoryDB, CategoryDBAddresses } from 'hero24-types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { CategorySubscriptionDto } from './category-subscription.dto';
import { questionsToTree } from 'src/modules/common/dto/question/question.utils/questions-to-tree.util';
import { PlainQuestion } from 'src/modules/common/dto/question/question.types';
import { QuestionsToArray } from 'src/modules/common/dto/question/question.utils/questions-to-array.util';
import { convertListToObjects } from 'src/modules/common/common.utils/convert-list-to-objects.util';
import { convertObjectToList } from 'src/modules/common/common.utils/convert-object-to-list.util';
import { omitUndefined } from 'src/modules/common/common.utils';

@ObjectType()
export class CategoryDto {
  @Field(() => String)
  id: string;

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
  isServiceProviderVATLocked?: boolean;

  @Field(() => Boolean, { nullable: true })
  isConstructionVAT?: boolean;

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
  toInternal(external) {
    const questions = external.questions.map((question) =>
      QuestionAdapter.toInternal(question),
    );
    return {
      ...external,
      addresses: external.addresses as CategoryDBAddresses,
      questions: questionsToTree(questions as PlainQuestion[]),
      id: external.id,
      packages: external.packages
        ? convertListToObjects(external.packages)
        : undefined,
      recommended: external.recommended
        ? convertListToObjects(external.recommended)
        : undefined,
      subscriptions: external.subscriptions
        ? convertListToObjects(external.subscriptions)
        : undefined,
    };
  },
  toExternal(internal) {
    const questions = QuestionsToArray(internal.questions) as QuestionDto[];
    return omitUndefined({
      ...internal,
      questions,
      id: internal.id,
      addresses: internal.addresses as CategoryDBAddresses,
      isServiceProviderVATLocked: internal.isServiceProviderVATLocked,
      isConstructionVAT: internal.isConstructionVAT,
      packages: internal.packages
        ? convertObjectToList(internal.packages)
        : undefined,
      recommended: internal.recommended
        ? convertObjectToList(internal.recommended)
        : undefined,
      subscriptions: internal.subscriptions
        ? convertObjectToList(internal.subscriptions)
        : undefined,
    });
  },
});
