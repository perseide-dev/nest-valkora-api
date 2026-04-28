import { IsString, IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class AssetsDto {
    @IsString()
    @IsOptional()
    banner?: string;

    @IsString()
    @IsOptional()
    profile1?: string;

    @IsString()
    @IsOptional()
    profile2?: string;

    @IsString()
    @IsOptional()
    albumn?: string;

    @IsString()
    @IsOptional()
    song?: string;

    @IsString()
    @IsOptional()
    favorite?: string;
}

class LoverDto {
    @IsUUID()
    @IsNotEmpty()
    partnerUuid: string;

    @IsString()
    @IsOptional()
    profileImg?: string;

    @IsString()
    @IsOptional()
    coverImg?: string;
}

class ProfileInfoDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    phrase?: string;

    @IsString()
    @IsNotEmpty()
    nationality: string;

    @IsString()
    @IsOptional()
    job?: string;

    @IsString()
    @IsNotEmpty()
    race: string;
}

export class CreateProfileDto {
    @IsObject()
    @Type(() => AssetsDto)
    assets: AssetsDto;

    @IsObject()
    @Type(() => LoverDto)
    lover: LoverDto;

    @IsObject()
    @Type(() => ProfileInfoDto)
    profileInfo: ProfileInfoDto;
}
