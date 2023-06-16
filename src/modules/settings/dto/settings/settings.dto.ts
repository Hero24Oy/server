import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ISettings } from '../../settings.types';
import { SettingsDataDto } from './settings-data.dto';

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
