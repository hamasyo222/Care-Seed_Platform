import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryContentDto } from './dto/query-content.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryDto: QueryContentDto) {
    const { skip, limit, search, categoryId, difficulty } = queryDto;
    const where: Prisma.learning_contentsWhereInput = {
      is_published: true,
      AND: [],
    };
    if (search) {
      (where.AND as any[]).push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    if (categoryId) {
      (where.AND as any[]).push({ category_id: categoryId });
    }
    if (difficulty) {
      (where.AND as any[]).push({ difficulty_level: difficulty });
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.learning_contents.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.learning_contents.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    const content = await this.prisma.learning_contents.findFirst({
      where: { id, is_published: true },
    });
    if (!content) {
      throw new NotFoundException(`Content with ID "${id}" not found`);
    }
    return content;
  }
}
