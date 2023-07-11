import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

const  validsRoles = ['user', 'admin', 'sudo'];

export class CreateUserDto {

    @IsString()
    userName: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener al menos una mayúscula, letras minusculas y al menos un número'    })
    password: string;


    @IsOptional()
    @IsString()
    role: string



    }