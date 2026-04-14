import { IsEmail, IsString, MinLength } from 'class-validator';
export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password dont match whit lenght min' })
    password: string;
}