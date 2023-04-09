import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';

import { GraphqlPubsubModule } from './modules/graphql-pubsub/graphql-pubsub.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AppResolver } from './app.resolver';
import config, { configValidationSchema } from './config';

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
        context: ({ req, res }) => ({ req, res }),
      }),
    }),
    GraphqlPubsubModule,
    FirebaseModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
