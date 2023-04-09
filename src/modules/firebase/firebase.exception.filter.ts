import {
  Catch,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(Error)
export class FirebaseExceptionFilter implements GqlExceptionFilter {
  private logger = new Logger(FirebaseExceptionFilter.name);

  catch(exception: Error) {
    if (exception.message === 'Permission denied') {
      return new ForbiddenException('Permission denied');
    }

    this.logger.error(exception);

    return new InternalServerErrorException('Internal server error');
  }
}
