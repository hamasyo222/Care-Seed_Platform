import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ContentService } from './content.service';
import { QueryContentDto } from './dto/query-content.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async findAll(@Query() queryDto: QueryContentDto) {
    const { data, total } = await this.contentService.findAll(queryDto);
    return {
      success: true,
      data,
      metadata: {
        total,
        page: queryDto.page,
        limit: queryDto.limit,
        hasNext: queryDto.page * queryDto.limit < total,
      },
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    const content = await this.contentService.findOne(id);
    return { success: true, data: content };
  }
}
