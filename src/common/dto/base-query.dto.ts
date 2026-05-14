import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class BaseQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    include?: string;

    @IsOptional()
    @IsString()
    search?: string;
}
