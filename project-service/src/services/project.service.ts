import { PrismaClient, projects, tasks } from '@prisma/client';
import { ICreateProjectRequest, ICreateTaskRequest, IUpdateTaskStatusRequest } from '../interfaces/project.interfaces';

const prisma = new PrismaClient();

export class ProjectService {
  async createProject(data: ICreateProjectRequest, creatorId: string): Promise<projects> {
    const { title, description, companyId, requiredSkills, rewardAmount, deadline } = data;
    return prisma.projects.create({
      data: {
        title,
        description,
        company_id: companyId,
        creator_id: creatorId,
        status: 'open',
        required_skills: { set: requiredSkills },
        reward_amount: rewardAmount,
        deadline: new Date(deadline),
      },
    });
  }

  async getProjectById(projectId: string) {
    return prisma.projects.findUnique({
      where: { id: projectId },
      include: { tasks: { orderBy: { created_at: 'asc' } } },
    });
  }

  async createTaskForProject(projectId: string, data: ICreateTaskRequest): Promise<tasks> {
    const { title, description, assigneeId } = data;
    return prisma.tasks.create({
      data: {
        project_id: projectId,
        title,
        description,
        status: 'todo',
        assignee_id: assigneeId,
      },
    });
  }
  
  async updateTaskStatus(taskId: string, data: IUpdateTaskStatusRequest): Promise<tasks> {
    const { status } = data;
    return prisma.tasks.update({
      where: { id: taskId },
      data: { status },
    });
  }
}