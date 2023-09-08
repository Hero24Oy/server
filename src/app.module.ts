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
import { NewsModule } from './modules/news/news.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SubscriberModule } from './modules/subscriber/subscriber.module';
import { OfferModule } from './modules/offer/offer.module';
import { PriceCalculatorModule } from './modules/price-calculator/price-calculator.module';
import { UserMergeModule } from './modules/user-merge/user-merge.module';
import { GraphQLConnectionParams } from './app.types';
import { FeeModule } from './modules/fee/fee.module';
import { PromotionModule } from './modules/buyer/promotions/promotion.module';
import { ImageModule } from './modules/image/image.module';

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
          'subscriptions-transport-ws': {
            onConnect: (connectionParams: GraphQLConnectionParams) =>
              graphQLManagerService.createContext({ connectionParams }),
          },
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
    NewsModule,
    SettingsModule,
    SubscriberModule,
    OfferModule,
    PriceCalculatorModule,
    UserMergeModule,
    FeeModule,
    PromotionModule,
    ImageModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
