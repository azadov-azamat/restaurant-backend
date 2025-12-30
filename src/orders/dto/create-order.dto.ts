import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    example: "clxxx-room-id",
    description: "Room ID where the table is located",
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    example: "clxxx-table-id",
    description: "Table ID (RoomElement ID with type TABLE)",
  })
  @IsString()
  tableId: string;

  @ApiPropertyOptional({
    example: "Please serve quickly",
    description: "Additional notes for the order",
  })
  @IsOptional()
  @IsString()
  note?: string;
}
