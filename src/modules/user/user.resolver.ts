import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';

import { UserCreationArgs } from './dto/creation/user-creation.args';
import { UserDataInput } from './dto/creation/user-data.input';
import { UserAdminStatusEditInput } from './dto/editAdminStatus/user-admin-status-edit-input';
import { UserDataEditingArgs } from './dto/editing/user-data-editing.args';
import { UserDto } from './dto/user/user.dto';
import { UserListDto } from './dto/users/user-list.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
  ): Promise<string> {
    return this.userService.getUserPhone(userId, app);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createUser(@Args() args: UserCreationArgs): Promise<UserDto> {
    const user = await this.userService.createUser(args);

    this.userService.emitUserCreate({ user });

    return user;
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AdminGuard)
  async createAdmin(@Args('data') data: UserDataInput): Promise<UserDto> {
    return this.userService.createAdmin(data);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editUserData(
    @Args() args: UserDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    const { userId } = args;
    const beforeUpdateUser = await this.userService.strictGetUserById(userId);
    const user = await this.userService.editUserData(args, app);

    this.userService.emitUserUpdate({ beforeUpdateUser, user });

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

    this.userService.emitUserUpdate({ beforeUpdateUser, user });

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
