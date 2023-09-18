import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { createSubscriptionEventEmitter } from '../graphql-pubsub/graphql-pubsub.utils';

import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserAdminStatusEditInput } from './dto/editAdminStatus/user-admin-status-edit-input';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { USER_CREATED_SUBSCRIPTION } from './user.constants';
import { UserService } from './user.service';

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
    const beforeUpdateUser = await this.userService.strictGetUserById(
      args.userId,
    );

    const user = await this.userService.editUserData(args, app);

    this.userService.emitUserUpdate({ beforeUpdateUser, user }, this.pubSub);

    return user;
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async editUserAdminStatus(
    @Args('input') input: UserAdminStatusEditInput,
  ): Promise<boolean> {
    const beforeUpdateUser = await this.userService.strictGetUserById(input.id);
    const user = await this.userService.editUserAdminStatus(input);

    this.userService.emitUserUpdate({ beforeUpdateUser, user }, this.pubSub);

    return Boolean(user);
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
