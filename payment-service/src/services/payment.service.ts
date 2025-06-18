import { PrismaClient } from '@prisma/client';
import { StripeService } from './stripe.service'; // Stripe連携は別サービスにカプセル化

const prisma = new PrismaClient();

export class PaymentService {
  private stripeService = new StripeService();

  /** プロジェクトの報酬支払い処理 */
  async processProjectReward(projectId: string, talentUserId: string): Promise<any> {
    const project = await prisma.projects.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');
    if (project.payment_status === 'paid') throw new Error('Project already paid for.');

    // ユーザーのStripe連結アカウントIDを取得
    const talentStripeAccountId = `acct_mock_${talentUserId}`; // In production, get from DB
    if (!talentStripeAccountId) throw new Error('Talent Stripe account not found.');

    // Stripeサービスを呼び出して送金処理
    const payout = await this.stripeService.createPayout(
      project.reward_amount.toNumber(), 'jpy', talentStripeAccountId, { projectId }
    );

    // プロジェクトの支払いステータスを更新
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: { payment_status: 'paid' },
    });

    return { success: true, paymentId: payout.id, status: payout.status, projectId: updatedProject.id };
  }
}
