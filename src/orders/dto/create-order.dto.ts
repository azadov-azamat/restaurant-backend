import { IsString, IsOptional } from "class-validator"

export class CreateOrderDto {
  @IsString()
  roomId: string

  @IsString()
  tableId: string

  @IsOptional()
  @IsString()
  note?: string
}
