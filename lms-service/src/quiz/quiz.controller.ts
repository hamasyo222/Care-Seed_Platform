import { Controller, Post, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../common/decorators/user.decorator';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post(':quizId/attempts')
  async startAttempt(
    @AuthenticatedUser('userId') userId: string,
    @Param('quizId', new ParseUUIDPipe()) quizId: string,
  ) {
    const result = await this.quizService.startAttempt(userId, quizId);
    return { success: true, data: result };
  }

  @Post('attempts/:attemptId/submit')
  async submitAttempt(
    @AuthenticatedUser('userId') userId: string,
    @Param('attemptId', new ParseUUIDPipe()) attemptId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    const result = await this.quizService.submitAttempt(userId, attemptId, submitQuizDto);
    return { success: true, data: result };
  }
}
