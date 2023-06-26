import { Field, InputType, PartialType } from '@nestjs/graphql';
import { NewsCreationInput } from '../creation/news-creation-input';

@InputType()
export class NewsEditingInput extends PartialType(NewsCreationInput) {
  @Field(() => String)
  id: string;
}
