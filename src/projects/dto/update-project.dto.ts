import { MinLength, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsNotEmpty()
  referringEmployeeId!: string;
}
