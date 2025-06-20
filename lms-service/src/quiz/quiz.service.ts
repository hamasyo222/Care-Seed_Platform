import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CertificateService } from '../certificate/certificate.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private certificateService: CertificateService,
  ) {}

  async startAttempt(userId: string, quizId: string) {
    const quiz = await this.prisma.quizzes.findUnique({
      where: { id: quizId },
      include: { quiz_questions: { orderBy: { sort_order: 'asc' } } },
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found`);
    }
    const attempt = await this.prisma.quiz_attempts.create({ data: { user_id: userId, quiz_id: quizId } });
    const questionsForUser = quiz.quiz_questions.map(({ correct_answers, ...q }) => q);
    return { attempt, questions: questionsForUser };
  }

  async submitAttempt(userId: string, attemptId: string, submitQuizDto: SubmitQuizDto) {
    // 正誤判定ロジックを改善
    const isCorrect = (userAnswerData: any, correctAnswerData: any): boolean => {
        // ユーザーの回答がなければ不正解
        if (userAnswerData === undefined || userAnswerData === null) return false;
        const userAnswer = userAnswerData.answer;

        // 正解が配列の場合 (複数選択問題など)
        if (Array.isArray(correctAnswerData)) {
            if (!Array.isArray(userAnswer)) return false;
            if (userAnswer.length !== correctAnswerData.length) return false;
            
            // 配列の内容が順序不同で一致するかチェック
            const sortedUserAnswer = [...userAnswer].sort();
            const sortedCorrectAnswer = [...correctAnswerData].sort();
            return JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer);
        }
        // 正解が配列でない場合は単純比較
        return userAnswer === correctAnswerData;
    };

    // 各問題を採点
    for (const question of attempt.quizzes.quiz_questions) {
        const userAnswer = submitQuizDto.answers.find(a => a.questionId === question.id);
        
        // 改善されたロジックで判定
        if (isCorrect(userAnswer, question.correct_answers)) {
            score += (question.points as number);
        }
    }


    const finalScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = finalScore >= (attempt.quizzes.passing_score as number);

    const updatedAttempt = await this.prisma.quiz_attempts.update({
      where: { id: attemptId },
      data: {
        completed_at: new Date(),
        score: finalScore,
        passed,
        answers: submitQuizDto.answers,
        time_taken: Math.floor((Date.now() - attempt.started_at.getTime()) / 1000),
      },
    });

    if (passed && attempt.quizzes.learning_contents) {
      await this.certificateService.issueCertificateForCompletion(userId, attempt.quizzes.learning_contents);
    }

    return { attemptId: updatedAttempt.id, score: updatedAttempt.score, passed: updatedAttempt.passed, feedback };
  }
}
