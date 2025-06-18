import { IsNotEmpty, IsString, IsUUID, IsDateString, IsObject } from 'class-validator';

class SalaryDto {
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    @IsString()
    type: 'monthly' | 'hourly' | 'annual';
}

export class GenerateContractDto {
  @IsNotEmpty()
  @IsUUID()
  talentId: string;

  @IsNotEmpty()
  @IsString()
  contractType: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsObject()
  salary: SalaryDto;
}
