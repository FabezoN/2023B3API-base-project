import {
  MinLength,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
export function isUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
