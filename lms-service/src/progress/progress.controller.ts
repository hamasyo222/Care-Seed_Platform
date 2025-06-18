import { Controller, Get, Patch, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../common/decorators/user.decorator';
import { UpdateProgressDto } from './dto/update-progress.dto';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getProgressForUser(@AuthenticatedUser('userId') userId: string) {
    const progress = await this.progressService.getProgressForUser(userId);
    return { success: true, data: progress };
  }

  @Patch(':contentId')
  async updateProgress(
    @AuthenticatedUser('userId') userId: string,
    @Param('contentId', new ParseUUIDPipe()) contentId: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    const updatedProgress = await this.progressService.updateProgress(userId, contentId, updateProgressDto);
    return { success: true, data: updatedProgress };
  }
}
