import { Field, ObjectType } from '@nestjs/graphql';
import { DictionaryDto } from './dictionary.dto';

@ObjectType()
export class SettingsDto {
    @Field(() => DictionaryDto, { nullable: true })
    langs: DictionaryDto | null;

    @Field(() => DictionaryDto, { nullable: true })
    workareas: DictionaryDto | null;
}
