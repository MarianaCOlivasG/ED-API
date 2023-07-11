import { IsString } from "class-validator"

export class FindNewBySlugDto {
    @IsString()
    slug: string
}
