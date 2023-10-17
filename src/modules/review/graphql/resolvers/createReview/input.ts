import { InputType, OmitType } from '@nestjs/graphql';

import { ReviewObject } from '../../objects';

@InputType()
export class CreateReviewInput extends OmitType(
  ReviewObject,
  ['createdAt', 'id'],
  InputType,
) {}
