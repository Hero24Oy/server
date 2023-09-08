import { ResolveField, Resolver, Root } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { OfferInitialDataDto } from '../dto/offer/offer-initial-data.dto';

@Resolver(() => OfferInitialDataDto)
export class OfferInitialDataFieldResolver {
  constructor(private readonly offerRequestService: OfferRequestService) {}

  @ResolveField(() => String, { nullable: true })
  async categoryId(
    @Root() parent: OfferInitialDataDto,
  ): Promise<MaybeType<string>> {
    const { offerRequestId } = parent;

    return this.offerRequestService.getCategoryIdByOfferRequestId(
      offerRequestId,
    );
  }
}
