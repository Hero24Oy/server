import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserService } from './user.service';
import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { createSubscriptionEventEmitter } from '../graphql-pubsub/graphql-pubsub.utils';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { PubSub } from 'graphql-subscriptions';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserAdminStatusEditingArgs } from './dto/editAdminStatus/user-admin-status-editing.args';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => UserDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async user(@Args('id') userId: string): Promise<UserDto | null> {
    return this.userService.getUserById(userId);
  }

  @Query(() => UserListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async users(
    @Args() args: UsersArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserListDto> {
    return this.userService.getUsers(args, app);
  }

  @Query(() => String)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async phone(
    @Args('userId') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.userService.getUserPhone(userId, app);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createUser(
    @Args() args: UserCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const emitUserCreated = createSubscriptionEventEmitter(
      USER_CREATED_SUBSCRIPTION,
    );
    const user = await this.userService.createUser(args, app);

    emitUserCreated<UserCreatedDto>(this.pubSub, { user });

    return user;
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editUserData(
    @Args() args: UserDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const emitUserUpdated = createSubscriptionEventEmitter(
      USER_UPDATED_SUBSCRIPTION,
    );

    const beforeUpdateUser = await this.userService.getUserById(args.userId);

    if (!beforeUpdateUser) {
      throw new Error(`User not found`);
    }

    const user = await this.userService.editUserData(args, app);

    emitUserUpdated<UserUpdatedDto>(this.pubSub, { user, beforeUpdateUser });

    return user;
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editUserAdminStatus(
    @Args() args: UserAdminStatusEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const emitUserUpdated = createSubscriptionEventEmitter(
      USER_UPDATED_SUBSCRIPTION,
    );
    const beforeUpdateUser = await this.userService.getUserById(args.userId);

    if (!beforeUpdateUser) {
      throw new Error(`User not found`);
    }

    const user = await this.userService.editUserAdminStatus(args, app);
    emitUserUpdated<UserUpdatedDto>(this.pubSub, { user, beforeUpdateUser });
    console.log({ user });
    return user;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async unbindUserOfferRequests(
    @Args('userId', { type: () => String }) userId: string,
    @Args('offerRequestIds', { type: () => [String] })
    offerRequestIds: string[],
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<boolean> {
    return this.userService.unbindUserOfferRequests(
      userId,
      offerRequestIds,
      app,
    );
  }
}
