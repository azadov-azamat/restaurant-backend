import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsBoolean, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ElementType } from "@prisma/client"

class ElementDto {
  @IsEnum(ElementType)
  type: ElementType

  @IsNumber()
  x: number

  @IsNumber()
  y: number

  @IsNumber()
  width: number

  @IsNumber()
  height: number

  @IsOptional()
  @IsNumber()
  rotation?: number

  @IsOptional()
  @IsString()
  tableCode?: string

  @IsOptional()
  @IsNumber()
  seats?: number

  @IsOptional()
  @IsBoolean()
  isRound?: boolean

  @IsOptional()
  @IsString()
  swingDirection?: string
}

export class UpdateElementsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementDto)
  elements: ElementDto[]
}
