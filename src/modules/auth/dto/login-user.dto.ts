import { IsEmail, IsString, MinLenght } from 'class-validator';
export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLenght(8, { message: 'Password dont match whit lenght min' })
    password: string;
}