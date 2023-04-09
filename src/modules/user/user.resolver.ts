import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';
import { DatabasePath } from '../firebase/firebase.constants';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { UserDto } from './dto/user';

@Resolver()
export class UserResolver {
  @Query(() => UserDto, { nullable: true })
  async user(
    @Args('id') userId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<UserDto | null> {
    const userSnapshot = await app
      .database()
      .ref(DatabasePath.USERS)
      .child(userId)
      .once('value');

    const user: UserDB | null = userSnapshot.val();

    return user && UserDto.convertFromFirebaseType(userId, user);
  }
}
