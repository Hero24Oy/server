import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class PromotionCreationArgs {
    @Field(() => String)
    promotionId: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    description: string;
    
    @Field(() => String)
    imageUrl: string;

    @Field(() => Date)
    startDate: Date;

    @Field(() => Date)
    endDate: Date;

    @Field(() => [String])
    categoryIds: string[];

    @Field(() => [String])
    serviceIds: string[];

    @Field(() => Boolean)
    isGlobal: boolean;

    @Field(() => Boolean)
    isForAllCategories: boolean;

    @Field(() => Boolean)
    isForAllServices: boolean;

    @Field(() => Boolean)
    isForAllCustomers: boolean;

    @Field(() => Boolean)
    isForAllServiceProviders: boolean;

    @Field(() => Boolean)
    isForAllLocations: boolean;

    @Field(() => Boolean)
    isForAllCustomerGroups: boolean;

    @Field(() => Boolean)
    isForAllServiceProviderGroups: boolean;

    @Field(() => Boolean)
    isForAllServiceHours: boolean;
}