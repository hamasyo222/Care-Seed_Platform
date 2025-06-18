import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentService } from '../document/document.service';
import { GenerateContractDto } from './dto/generate-contract.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EmploymentService {
  constructor(
    private prisma: PrismaService,
    private documentService: DocumentService,
  ) {}

  async generateContract(companyId: string, dto: GenerateContractDto) {
    const company = await this.prisma.companies.findUnique({ where: { id: companyId } });
    const talent = await this.prisma.users.findUnique({ where: { id: dto.talentId }, include: { profile: true } });
    if (!company || !talent || !talent.profile) {
      throw new NotFoundException('Company or Talent not found.');
    }
    const templateData = {
      company: { name: company.name },
      talent: { profile: { first_name: talent.profile.first_name, last_name: talent.profile.last_name } },
      contract: {
        startDate: new Date(dto.startDate).toLocaleDateString('ja-JP'),
        jobTitle: dto.jobTitle,
        salary: dto.salary,
      },
    };
    const templatePath = path.join(__dirname, '..', 'document', 'templates', 'contract.hbs');
    const templateString = await fs.readFile(templatePath, 'utf-8');
    const pdfBuffer = await this.documentService.createPdfFromTemplate(templateString, templateData);
    const contractNumber = `C${new Date().getFullYear()}${Math.floor(Math.random() * 100000)}`;
    const pdfKey = `contracts/${companyId}/${dto.talentId}/${contractNumber}.pdf`;
    const pdfUrl = await this.documentService.uploadToS3(pdfBuffer, pdfKey);
    const newContract = await this.prisma.employment_contracts.create({
      data: {
        company_id: companyId,
        employee_user_id: dto.talentId,
        contract_type: dto.contractType,
        contract_number: contractNumber,
        start_date: new Date(dto.startDate),
        job_title: dto.jobTitle,
        base_salary: dto.salary.amount,
        salary_type: dto.salary.type,
        status: 'draft',
        contract_file_url: pdfUrl,
      },
    });
    return newContract;
  }
}
