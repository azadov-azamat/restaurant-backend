import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ElementType } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class ElementDto {
  @ApiProperty({
    enum: ElementType,
    example: ElementType.TABLE,
    description: "Type of room element",
  })
  @IsEnum(ElementType)
  type: ElementType;

  @ApiProperty({
    example: 5.0,
    description: "X coordinate in meters",
  })
  @IsNumber()
  x: number;

  @ApiProperty({
    example: 3.0,
    description: "Y coordinate in meters",
  })
  @IsNumber()
  y: number;

  @ApiProperty({
    example: 1.2,
    description: "Width in meters",
  })
  @IsNumber()
  width: number;

  @ApiProperty({
    example: 0.8,
    description: "Height in meters",
  })
  @IsNumber()
  height: number;

  @ApiPropertyOptional({
    example: 0,
    description: "Rotation in degrees (0, 90, 180, 270)",
  })
  @IsOptional()
  @IsNumber()
  rotation?: number;

  @ApiPropertyOptional({
    example: "A1",
    description: "Table code (for TABLE type only)",
  })
  @IsOptional()
  @IsString()
  tableCode?: string;

  @ApiPropertyOptional({
    example: 4,
    description: "Number of seats (for TABLE type only)",
  })
  @IsOptional()
  @IsNumber()
  seats?: number;

  @ApiPropertyOptional({
    example: false,
    description: "Is table round (for TABLE type only)",
  })
  @IsOptional()
  @IsBoolean()
  isRound?: boolean;

  @ApiPropertyOptional({
    example: "left",
    description: "Door swing direction (for DOOR type only)",
  })
  @IsOptional()
  @IsString()
  swingDirection?: string;
}

export class UpdateElementsDto {
  @ApiProperty({
    type: [ElementDto],
    description: "Array of room elements (tables, chairs, doors, etc.)",
    example: [
      {
        type: "TABLE",
        x: 5.0,
        y: 3.0,
        width: 1.2,
        height: 0.8,
        rotation: 0,
        tableCode: "A1",
        seats: 4,
        isRound: false,
      },
      {
        type: "DOOR",
        x: 0.0,
        y: 5.0,
        width: 1.0,
        height: 0.2,
        rotation: 0,
        swingDirection: "left",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementDto)
  elements: ElementDto[];
}
