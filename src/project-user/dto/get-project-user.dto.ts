import { IsNotEmpty } from 'class-validator';

export class GetProjectUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  userId: string;
}
