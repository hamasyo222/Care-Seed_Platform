import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CertificateModule } from '../certificate/certificate.module';

@Module({
  imports: [PrismaModule, CertificateModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
