import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';

import { GraphqlPubsubModule } from './modules/graphql-pubsub/graphql-pubsub.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AppResolver } from './app.resolver';
import config, { configValidationSchema } from './config';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './modules/common/common.module';
import { BuyerModule } from './modules/buyer/buyer.module';
import { SellerModule } from './modules/seller/seller.module';

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
    UserModule,
    CommonModule,
    BuyerModule,
    SellerModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
