import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { FirebaseExceptionFilter } from 'src/modules/firebase/firebase.exception.filter';
import { OfferRequestListDto } from '../dto/offer-request-list/offer-request-list.dto';
import { OpenOfferRequestListInput } from '../dto/open-offer-request-list/open-offer-request-list.input';
import { OfferRequestService } from '../offer-request.service';
import { OfferRequestStatus } from '../offer-request.constants';
import { AuthIdentity } from 'src/modules/auth/auth.decorator';
import { Identity } from 'src/modules/auth/auth.types';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { OfferRole } from 'src/modules/offer/dto/offer/offer-role.enum';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
export class OfferRequestSellerResolver {
  constructor(private offerRequestService: OfferRequestService) {}

  @Query(() => OfferRequestListDto)
  @UseGuards(AuthGuard)
  openOfferRequestList(
    @Args('input') input: OpenOfferRequestListInput,
    @AuthIdentity() identity: Identity,
  ): Promise<OfferRequestListDto> {
    return this.offerRequestService.getOfferRequestList(
      {
        ...input,
        filter: {
          status: [OfferRequestStatus.OPEN],
        },
        role: OfferRole.SELLER,
      },
      identity,
    );
  }
}
