import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';

import { GraphQLContextManagerModule } from './modules/graphql-context-manager/graphql-context-manager.module';
import { GraphQLContextManagerService } from './modules/graphql-context-manager/graphql-context-manager.service';
import { GraphQLPubsubModule } from './modules/graphql-pubsub/graphql-pubsub.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AppResolver } from './app.resolver';
import config, { configValidationSchema } from './config';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './modules/common/common.module';
import { BuyerModule } from './modules/buyer/buyer.module';
import { SellerModule } from './modules/seller/seller.module';
import { OfferRequestModule } from './modules/offer-request/offer-request.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthModule } from './modules/auth/auth.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [GraphQLContextManagerModule.forRoot()],
      inject: [ConfigService, GraphQLContextManagerService],
      useFactory: (
        configService: ConfigService,
        graphQLManagerService: GraphQLContextManagerService,
      ): ApolloDriverConfig => ({
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': true,
        },
        playground: configService.get<boolean>('app.isDevelopment'),
        context: async (ctx) => graphQLManagerService.createContext(ctx),
      }),
    }),
    GraphQLPubsubModule,
    FirebaseModule,
    UserModule,
    CommonModule,
    BuyerModule,
    SellerModule,
    OfferRequestModule,
    ChatModule,
    AuthModule,
    SettingsModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
