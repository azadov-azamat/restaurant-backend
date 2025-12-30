import {
  IsArray,
  IsString,
  IsInt,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class OrderItemDto {
  @ApiProperty({
    example: "clxxx-menu-item-id",
    description: "Menu item ID",
  })
  @IsString()
  menuItemId: string;

  @ApiProperty({
    example: 2,
    description: "Quantity of items",
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: "No onions please",
    description: "Special instructions for this item",
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class AddItemsDto {
  @ApiProperty({
    type: [OrderItemDto],
    description: "List of items to add to the order",
    example: [
      {
        menuItemId: "clxxx-item-1",
        quantity: 2,
        note: "Extra spicy",
      },
      {
        menuItemId: "clxxx-item-2",
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
