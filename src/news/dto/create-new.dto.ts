import { IsArray, IsDate, IsString } from "class-validator"

export class CreateNewDto {

    @IsString()
    date: string
    
    @IsString()
    title: string

    @IsString()
    body: string

    @IsString()
    slug: string
    
    @IsArray()
    images: string[]

    @IsArray()
    labels: string[]


}
