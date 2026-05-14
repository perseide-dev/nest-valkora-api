import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsOptional()
    @IsString()
    accountName?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsUUID()
    rolUuid: string;

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    controlGroupUuids?: string[];
}
