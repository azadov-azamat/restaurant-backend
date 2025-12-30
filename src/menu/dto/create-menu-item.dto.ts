import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
} from "class-validator";
import { MenuItemType } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMenuItemDto {
  @ApiProperty({
    example: "Osh",
    description: "Name of the menu item",
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: "Traditional Uzbek rice dish with meat and vegetables",
    description: "Description of the menu item",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 25000,
    description: "Price in UZS",
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    example: "https://example.com/osh.jpg",
    description: "Image URL",
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    enum: MenuItemType,
    example: MenuItemType.FOOD,
    description: "Type of menu item",
  })
  @IsOptional()
  @IsEnum(MenuItemType)
  type?: MenuItemType;

  @ApiProperty({
    example: "clxxx-category-id",
    description: "Category ID",
  })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether item requires kitchen preparation",
  })
  @IsOptional()
  @IsBoolean()
  requiresKitchen?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Whether item is in stock",
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    example: 50,
    description: "Available quantity (null = unlimited)",
  })
  @IsOptional()
  @IsInt()
  quantity?: number;
}
