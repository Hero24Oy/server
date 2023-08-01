import { InputType, OmitType } from '@nestjs/graphql';
import { PromotionDto } from './promotion.dto';


@InputType()
export class PromotionsCreationInput extends OmitType(PromotionDto, ['id'], InputType) {}
