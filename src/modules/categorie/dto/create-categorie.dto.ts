import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategorieDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
