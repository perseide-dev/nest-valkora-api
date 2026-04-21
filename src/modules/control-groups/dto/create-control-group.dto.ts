import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateControlGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
