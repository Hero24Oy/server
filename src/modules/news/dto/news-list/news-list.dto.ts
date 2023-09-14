import { ObjectType } from '@nestjs/graphql';

import { NewsDto } from '../news/news.dto';

import { Paginated } from '$modules/common/dto/pagination.dto';

@ObjectType()
export class NewsListDto extends Paginated(NewsDto) {}
