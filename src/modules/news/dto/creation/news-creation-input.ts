import { InputType, OmitType } from '@nestjs/graphql';

import { NewsDto } from '../news/news.dto';

@InputType()
export class NewsCreationInput extends OmitType(NewsDto, ['id'], InputType) {}
