import { PrismaClient } from '@prisma/client';
import { StripeService } from './stripe.service';

const prisma = new PrismaClient();

export class PaymentService {
  private stripeService = new StripeService();

  async processProjectReward(projectId: string): Promise<any> {
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: { tasks: { where: { assignee_id: { not: null } } } }
    });

    if (!project) throw new Error('Project not found');
    if (project.payment_status === 'paid') throw new Error('Project already paid for.');
    
    const talentUserId = project.tasks[0]?.assignee_id;
    if (!talentUserId) throw new Error('No assignee found for this project.');

    const talent = await prisma.users.findUnique({ where: { id: talentUserId } });
    if (!talent?.stripe_account_id) throw new Error('Talent Stripe account not found.');

    const payout = await this.stripeService.createPayout(
      project.reward_amount.toNumber(), 'jpy', talent.stripe_account_id, { projectId }
    );

    await prisma.projects.update({
      where: { id: projectId },
      data: { payment_status: 'paid', payment_details: payout as any },
    });

    return { success: true, paymentId: payout.id, status: payout.status, projectId: project.id };
  }
}