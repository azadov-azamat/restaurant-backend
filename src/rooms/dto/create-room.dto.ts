import { IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {
  @ApiProperty({
    example: "Main Hall",
    description: "Room name",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "clxxx-floor-id",
    description: "Floor ID",
  })
  @IsString()
  floorId: string;

  @ApiProperty({
    example: 15.5,
    description: "Room width in meters",
  })
  @IsNumber()
  width: number;

  @ApiProperty({
    example: 12.0,
    description: "Room height in meters",
  })
  @IsNumber()
  height: number;
}
