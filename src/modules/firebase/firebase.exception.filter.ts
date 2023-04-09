import {
  Catch,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(Error)
export class FirebaseExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error) {
    if (exception.message === 'Permission denied') {
      return new ForbiddenException('Permission denied');
    }

    console.error(exception);

    return new InternalServerErrorException('Internal server error');
  }
}
