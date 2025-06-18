import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmploymentService } from './employment.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../common/decorators/user.decorator';
import { GenerateContractDto } from './dto/generate-contract.dto';

@UseGuards(JwtAuthGuard)
@Controller('employment')
export class EmploymentController {
  constructor(private readonly employmentService: EmploymentService) {}

  @Post('contracts')
  async generateContract(
    @AuthenticatedUser() user: { userId: string; companyId: string },
    @Body() generateContractDto: GenerateContractDto,
  ) {
    const mockCompanyId = 'd4a7f053-c475-4a69-963e-9e734c4d79e6';
    const contract = await this.employmentService.generateContract(mockCompanyId, generateContractDto);
    return { success: true, data: contract };
  }
}
