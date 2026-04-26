import { IsString, IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class AssetsDto {
    @IsString()
    @IsNotEmpty()
    banner: string;

    @IsString()
    @IsNotEmpty()
    profile1: string;

    @IsString()
    @IsNotEmpty()
    profile2: string;

    @IsString()
    @IsNotEmpty()
    albumn: string;

    @IsString()
    @IsNotEmpty()
    song: string;

    @IsString()
    @IsNotEmpty()
    favorite: string;
}

class LoverDto {
    @IsString()
    @IsNotEmpty()
    profileImg: string;

    @IsString()
    @IsNotEmpty()
    coverImg: string;
}

class ProfileInfoDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phrase: string;

    @IsString()
    @IsNotEmpty()
    nationality: string;

    @IsString()
    @IsNotEmpty()
    job: string;

    @IsString()
    @IsNotEmpty()
    race: string;
}

export class CreateProfileDto {
    @IsUUID()
    @IsNotEmpty()
    userUuid: string;

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
