import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  silly() {
    return `Hello, world!`;
  }
}
