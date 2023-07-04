import { Field, ObjectType } from '@nestjs/graphql';
import { UserMergeDB } from 'hero24-types';
import MergeStatus from './merge-status.dto';

@ObjectType()
export class UserMergeDto {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  emailToSearch?: string;

  @Field(() => String, { nullable: true })
  emailStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  emailVerifiedByUser?: boolean;

  @Field(() => String, { nullable: true })
  phoneToSearch?: string;

  @Field(() => String, { nullable: true })
  phoneStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  phoneVerifiedByUser?: boolean;

  @Field(() => Number, { nullable: true })
  createdAt?: number;

  static convertFromFirebaseType(userMerge: UserMergeDB): UserMergeDto {
    return {
      userId: userMerge.userId,
      emailToSearch: userMerge.emailToSearch,
      emailStatus: userMerge.emailStatus as MergeStatus,
      emailVerifiedByUser: userMerge.emailVerifiedByUser,
      phoneToSearch: userMerge.phoneToSearch,
      phoneStatus: userMerge.phoneStatus as MergeStatus,
      phoneVerifiedByUser: userMerge.phoneVerifiedByUser,
      createdAt: userMerge.createdAt,
    };
  }
}
