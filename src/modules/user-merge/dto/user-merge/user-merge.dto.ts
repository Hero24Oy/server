import { Field, ObjectType } from '@nestjs/graphql';
import { UserMergeDB } from 'hero24-types';
import MergeStatus from './merge-status.dto';
import { omitUndefined } from 'src/modules/common/common.utils';
import { MaybeType } from 'src/modules/common/common.types';

@ObjectType()
export class UserMergeDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  emailToSearch: string;

  @Field(() => String)
  emailStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  emailVerifiedByUser?: MaybeType<boolean>;

  @Field(() => String)
  phoneToSearch: string;

  @Field(() => String)
  phoneStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  phoneVerifiedByUser?: MaybeType<boolean>;

  @Field(() => Number)
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

  static convertToFirebaseType(
    userMergeData: UserMergeDto,
  ): Omit<UserMergeDB, 'createdAt'> {
    return omitUndefined({
      ...userMergeData,
    });
  }
}
