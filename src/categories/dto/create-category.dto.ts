import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    example: "Hot Dishes",
    description: "Category name",
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: "#ff6b6b",
    description: "Category color (hex format)",
  })
  @IsOptional()
  @IsString()
  color?: string;
}
