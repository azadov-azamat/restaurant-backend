import { IsString, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFloorDto {
  @ApiProperty({
    example: "First Floor",
    description: "Floor name",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: "Floor level number",
  })
  @IsInt()
  level: number;
}
