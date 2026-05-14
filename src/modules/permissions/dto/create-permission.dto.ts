import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Modules } from 'src/common/enums/module.enum';
import { Focus } from 'src/common/enums/focus.enum';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    permissionName: string;

    @IsEnum(Modules)
    @IsNotEmpty()
    module: Modules;

    @IsEnum(Focus)
    @IsOptional()
    focus?: Focus;

    @IsBoolean()
    @IsOptional()
    create?: boolean;

    @IsBoolean()
    @IsOptional()
    read?: boolean;

    @IsBoolean()
    @IsOptional()
    update?: boolean;

    @IsBoolean()
    @IsOptional()
    delete?: boolean;

    @IsUUID()
    @IsNotEmpty()
    rolUuid: string;
}
