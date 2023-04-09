import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { OfferRequestCreationArgs } from './dto/creation/offer-request-creation.args';
import { OfferRequestDto } from './dto/offer-request/offer-request.dto';
import { OfferRequestService } from './offer-request.service';

@Resolver()
export class OfferRequestResolver {
  constructor(private offerRequestService: OfferRequestService) {}

  @Query(() => OfferRequestDto, { nullable: true })
  async offerRequest(
    @Args('id') offerRequestId: string,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto | null> {
    return this.offerRequestService.getOfferRequestById(offerRequestId, app);
  }

  @Mutation(() => OfferRequestDto)
  async createOfferRequest(
    @Args() args: OfferRequestCreationArgs,
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<OfferRequestDto> {
    return this.offerRequestService.createOfferRequest(args, app);
  }
}
