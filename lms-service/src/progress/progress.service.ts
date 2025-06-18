import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(userId: string, contentId: string, updateProgressDto: UpdateProgressDto) {
    const { progressPercentage, timeSpent } = updateProgressDto;

    const existingProgress = await this.prisma.learning_progress.findUnique({
      where: { user_id_content_id: { user_id: userId, content_id: contentId } },
    });

    let status = 'in_progress';
    let completed_at: Date | null = existingProgress?.completed_at || null;
    if (progressPercentage >= 100) {
      status = 'completed';
      if (!completed_at) {
        completed_at = new Date();
      }
    }

    return this.prisma.learning_progress.upsert({
      where: {
        user_id_content_id: { user_id: userId, content_id: contentId },
      },
      update: {
        progress_percentage: progressPercentage,
        time_spent: { increment: timeSpent },
        status,
        completed_at,
        last_accessed_at: new Date(),
      },
      create: {
        user_id: userId,
        content_id: contentId,
        progress_percentage: progressPercentage,
        time_spent: timeSpent,
        status,
        completed_at,
        started_at: new Date(),
        last_accessed_at: new Date(),
      },
    });
  }

  async getProgressForUser(userId: string) {
    return this.prisma.learning_progress.findMany({
      where: { user_id: userId },
      orderBy: { last_accessed_at: 'desc' },
      include: {
        learning_contents: {
          select: {
            title: true,
            thumbnail_url: true,
            difficulty_level: true,
          }
        }
      }
    });
  }
}
