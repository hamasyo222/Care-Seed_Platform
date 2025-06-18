import { PrismaClient, projects, tasks } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectService {
  /** 新しいプロジェクトを作成 */
  async createProject(data: any, creatorId: string): Promise<projects> {
    const { title, description, companyId, requiredSkills, rewardAmount, deadline } = data;
    return prisma.projects.create({
      data: {
        title,
        description,
        company_id: companyId,
        creator_id: creatorId,
        status: 'open',
        required_skills: requiredSkills,
        reward_amount: rewardAmount,
        deadline: new Date(deadline),
      },
    });
  }

  /** プロジェクト詳細（タスク含む）を取得 */
  async getProjectById(projectId: string) {
    return prisma.projects.findUnique({
      where: { id: projectId },
      include: { tasks: { orderBy: { created_at: 'asc' } } },
    });
  }
}
