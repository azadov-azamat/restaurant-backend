import { IsString, IsInt } from "class-validator";

export class CreateFloorDto {
  @IsString()
  name: string;

  @IsInt()
  level: number;
}
