import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
} from "class-validator";
import { MenuItemType } from "@prisma/client";

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(MenuItemType)
  type?: MenuItemType;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  requiresKitchen?: boolean;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
