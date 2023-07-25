import { ArgsType, Field } from '@nestjs/graphql';
import { FeeDataDto } from '../fee/fee-data.dto';

@ArgsType()
export class FeeEditingArgs {
  @Field(() => FeeDataDto)
  data: FeeDataDto;

  @Field(() => String)
  id: string;
}
