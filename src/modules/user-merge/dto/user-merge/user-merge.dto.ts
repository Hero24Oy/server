import { Field, ObjectType } from '@nestjs/graphql';
import { UserMergeDB } from 'hero24-types';

import { MergeStatus } from './merge-status.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class UserMergeDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  emailToSearch: string;

  @Field(() => MergeStatus)
  emailStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  emailVerifiedByUser?: boolean;

  @Field(() => String)
  phoneToSearch: string;

  @Field(() => MergeStatus)
  phoneStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  phoneVerifiedByUser?: boolean;

  @Field(() => Date)
  createdAt: Date;

  static adapter: FirebaseAdapter<UserMergeDB, UserMergeDto>;
}

UserMergeDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    userId: internal.userId,
    emailToSearch: internal.emailToSearch,
    emailStatus: internal.emailStatus as MergeStatus,
    emailVerifiedByUser: internal.emailVerifiedByUser,
    phoneToSearch: internal.phoneToSearch,
    phoneStatus: internal.phoneStatus as MergeStatus,
    phoneVerifiedByUser: internal.phoneVerifiedByUser,
    createdAt: new Date(internal.createdAt),
  }),
  toInternal: (external) => ({
    userId: external.userId,
    emailToSearch: external.emailToSearch,
    emailStatus: external.emailStatus,
    emailVerifiedByUser: external.emailVerifiedByUser ?? undefined,
    phoneToSearch: external.phoneToSearch,
    phoneStatus: external.phoneStatus,
    phoneVerifiedByUser: external.phoneVerifiedByUser ?? undefined,
    createdAt: Number(external.createdAt),
  }),
});
