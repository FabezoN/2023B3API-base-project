import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
