import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested  } from "class-validator";
import { CreateDepartmentDto } from "src/department/types/dto/create-department.dto";

export class CreateSiteDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: [
          {
            name: "department name",
            services: [
              {
                name: "service name",
                locations: [
                  {
                    name: "location name"
                  }
                ]
              }
            ]
          }
        ]
      })
    @ValidateNested()  
    @Type(() => CreateDepartmentDto)
    @IsOptional()  
    department?: CreateDepartmentDto[];
}