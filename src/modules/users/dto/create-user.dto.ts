import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    accountName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsNumber()
    rolId: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    controlGroupIds?: number[];
}
