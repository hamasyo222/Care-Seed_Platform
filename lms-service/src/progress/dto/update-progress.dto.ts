import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  timeSpent: number;
}
