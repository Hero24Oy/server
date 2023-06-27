import { UseFilters } from '@nestjs/common';
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

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async user(
    @Args('id') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto | null> {
    return this.userService.getUserById(userId, app);
  }

  @Query(() => UserListDto)
  @UseFilters(FirebaseExceptionFilter)
  async users(
    @Args() args: UsersArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserListDto> {
    return this.userService.getUsers(args, app);
  }

  @Query(() => String)
  @UseFilters(FirebaseExceptionFilter)
  async phone(
    @Args('userId') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ) {
    return this.userService.getUserPhone(userId, app);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  async createUser(
    @Args() args: UserCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    return this.userService.createUser(args, app);
  }

  @Mutation(() => UserDto)
  @UseFilters(FirebaseExceptionFilter)
  async editUserData(
    @Args() args: UserDataEditingArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto> {
    return this.userService.editUserData(args, app);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
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
