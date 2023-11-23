import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BrowserInfoDataObject {
  @Field(() => String)
  acceptHeader: string;

  @Field(() => Boolean)
  javaEnabled: boolean;

  @Field(() => String)
  language: string;

  @Field(() => Int)
  colorDepth: number;

  @Field(() => Int)
  screenHeight: number;

  @Field(() => String)
  screenWidth: number;

  @Field(() => Boolean)
  javascriptEnabled: boolean;

  @Field(() => String)
  timeZoneOffset: string;

  @Field(() => String)
  userAgent: string;
}
