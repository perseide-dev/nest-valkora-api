import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum, IsBoolean, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { Modules } from 'src/common/enums/module.enum';
import { Focus } from 'src/common/enums/focus.enum';

export class NestedPermissionDto {
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
}

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    rolName: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => NestedPermissionDto)
    permissions: NestedPermissionDto[];
}
