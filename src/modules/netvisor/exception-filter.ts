import { Catch, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(Error)
export class NetvisorExceptionFilter implements GqlExceptionFilter {
  private logger = new Logger(NetvisorExceptionFilter.name);

  catch(exception: Error): void {
    this.logger.error(exception);
  }
}
