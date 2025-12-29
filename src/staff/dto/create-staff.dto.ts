import { IsString, IsEnum, IsOptional, MinLength } from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateStaffDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
