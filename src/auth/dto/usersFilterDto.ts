

import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/PaginationDto";

export class UsersFilterDto extends PartialType(PaginationDto) {

    @IsString()
    role: string;

}
