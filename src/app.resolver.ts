import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  silly(): string {
    return 'Hello, World!';
  }
}
