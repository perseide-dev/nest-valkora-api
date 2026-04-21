import { IsEmail, IsString, MinLength } from 'class-validator';
export class LoginUserDto {
    @IsString()
    email: string; // Se mantiene el nombre por compatibilidad con el JSON, pero se trata como identidad.

    @IsString()
    @MinLength(4, { message: 'Password does not meet the minimum length requirement' })
    password: string;
}