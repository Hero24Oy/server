import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LangObj {
    @Field(() => [String], { nullable: true })
    en: string[] | null;

    @Field(() => [String], { nullable: true })
    fi: string[] | null;
}

@ObjectType()
export class SettingsDto {
    @Field(() => LangObj, { nullable: true })
    langs: LangObj | null;

    @Field(() => LangObj, { nullable: true })
    workareas: LangObj | null;
}
