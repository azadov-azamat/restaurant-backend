import { IsArray, IsString, IsInt, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class OrderItemDto {
  @IsString()
  menuItemId: string

  @IsInt()
  quantity: number

  @IsOptional()
  @IsString()
  note?: string
}

export class AddItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
