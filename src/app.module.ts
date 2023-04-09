import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import config, { configValidationSchema } from './config';
import { GraphqlPubsubModule } from './modules/graphql-pubsub/graphql-pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ApolloDriverConfig => ({
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': true,
        },
        playground: configService.get<boolean>('app.isDevelopment'),
      }),
    }),
    GraphqlPubsubModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
