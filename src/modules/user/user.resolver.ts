import { Args, Query, Resolver } from '@nestjs/graphql';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user/user.dto';
import { UsersDto } from './dto/users/users.dto';
import { UsersArgs } from './dto/users/users.args';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserDto, { nullable: true })
  async user(
    @Args('id') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto | null> {
    return this.userService.getUserById(userId, app);
  }

  @Query(() => UsersDto)
  async users(
    @Args() args: UsersArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UsersDto> {
    return this.userService.getUsers(args, app);
  }
}
