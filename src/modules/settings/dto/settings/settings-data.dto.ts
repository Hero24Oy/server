import { Field, Float, ObjectType } from '@nestjs/graphql';
import { buildSchema } from 'graphql';
import { ISettings } from '../../settings.types';

let SettingsSchema = buildSchema(`
type langs {
    en: [String]
    fi: [String]
}

type workareas {
    en: [String]
    fi: [String]
}
`);

/*
  @Field(() => [String], { nullable: true })
  mergedUsers?: string[];
*/

@ObjectType()
export class LangObj {
    @Field(() => [String], { nullable: true })
    en: string[] | null;

    @Field(() => [String], { nullable: true })
    fi: string[] | null;
}


@ObjectType()
export class SettingsDataDto {
    @Field(() => LangObj, { nullable: true })
    langs: LangObj | null;

    @Field(() => LangObj, { nullable: true })
    workareas: LangObj | null;
    
}
