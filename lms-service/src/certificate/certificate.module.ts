import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
