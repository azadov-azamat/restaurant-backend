import { IsString, IsNumber } from "class-validator";

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  floorId: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
