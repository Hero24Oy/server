import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';

import { AppResolver } from './app.resolver';
import { GraphQlBaseContext, GraphQlConnectionParams } from './app.types';
import config, {
  CONFIG_PROVIDER,
  ConfigType,
  configValidationSchema,
} from './config';
import { AuthModule } from './modules/auth/auth.module';
import { BuyerModule } from './modules/buyer/buyer.module';
import { CategoryGroupModule } from './modules/category-group/module';
import { ChatModule } from './modules/chat/chat.module';
import { CommonModule } from './modules/common/common.module';
import { FeeModule } from './modules/fee/fee.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { GraphQlContextManagerModule } from './modules/graphql-context-manager/graphql-context-manager.module';
import { GraphQlContextManagerService } from './modules/graphql-context-manager/graphql-context-manager.service';
import { GraphQlPubsubModule } from './modules/graphql-pubsub/graphql-pubsub.module';
import { ImageModule } from './modules/image/image.module';
import { NewsModule } from './modules/news/news.module';
import { OfferModule } from './modules/offer/offer.module';
import { OfferRequestModule } from './modules/offer-request/offer-request.module';
import { PriceCalculatorModule } from './modules/price-calculator/price-calculator.module';
import { ReviewModule } from './modules/review/module';
import { SellerModule } from './modules/seller/seller.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SubscriberModule } from './modules/subscriber/subscriber.module';
import { UserModule } from './modules/user/user.module';
import { UserMergeModule } from './modules/user-merge/user-merge.module';

import { CryptoModule } from '$modules/crypto/module';
import { CustomScheduleModule } from '$modules/custom-schedule/module';
import { HeroPortfolioModule } from '$modules/hero-portfolio/module';
import { NetvisorModule } from '$modules/netvisor/module';
import { XmlJsModule } from '$modules/xml-js/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [GraphQlContextManagerModule.forRoot()],
      inject: [CONFIG_PROVIDER, GraphQlContextManagerService],
      useFactory: (
        serverConfig: ConfigType,
        graphQLManagerService: GraphQlContextManagerService,
      ): ApolloDriverConfig => ({
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': {
            onConnect: (connectionParams: GraphQlConnectionParams) =>
              graphQLManagerService.createContext({ connectionParams }),
          },
        },
        playground: serverConfig.app.isDevelopment,
        context: async (ctx: GraphQlBaseContext) =>
          graphQLManagerService.createContext(ctx),
      }),
    }),
    ScheduleModule.forRoot(),
    GraphQlPubsubModule,
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
    ImageModule,
    ReviewModule,
    CategoryGroupModule,
    HeroPortfolioModule,
    NetvisorModule,
    CryptoModule,
    XmlJsModule,
    CustomScheduleModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
