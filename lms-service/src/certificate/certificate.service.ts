import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { learning_contents } from '@prisma/client';
import crypto from 'crypto';

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  async issueCertificateForCompletion(userId: string, content: learning_contents) {
    const existingCertificate = await this.prisma.certificates.findFirst({
      where: { user_id: userId, content_id: content.id },
    });
    if (existingCertificate) {
      return null;
    }
    const newCertificate = await this.prisma.certificates.create({
      data: {
        user_id: userId,
        content_id: content.id,
        certificate_type: 'completion',
        title: `${content.title} Completion Certificate`,
        verification_code: crypto.randomBytes(8).toString('hex'),
        certificate_url: `https://dx-seed.com/certs/${userId}/${content.id}`,
      },
    });
    return newCertificate;
  }
}
