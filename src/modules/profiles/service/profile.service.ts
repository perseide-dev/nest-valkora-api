import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';
import { Profile } from '../entities/profile.entity';
import { Assets } from '../entities/assets.enttity';
import { Lover } from '../entities/lover.entity';
import { ProfileInfo } from '../entities/profileInfo.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { FindAllProfilesDto } from '../dto/find-all-profiles.dto';
import { parseIncludes } from 'src/common/utils/typeorm-query.helper';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Assets)
    private readonly assetsRepository: Repository<Assets>,
    @InjectRepository(Lover)
    private readonly loverRepository: Repository<Lover>,
    @InjectRepository(ProfileInfo)
    private readonly profileInfoRepository: Repository<ProfileInfo>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async create(userUuid: string, createProfileDto: CreateProfileDto) {
    const { assets, lover, profileInfo } = createProfileDto;

    // 1. Find the user
    const user = await this.userRepository.findOne({ where: { uuid: userUuid } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 2. Create sub-entities
    const newAssets = this.assetsRepository.create(assets);
    const newLover = this.loverRepository.create(lover);
    const newProfileInfo = this.profileInfoRepository.create(profileInfo);

    await this.assetsRepository.save(newAssets);
    await this.loverRepository.save(newLover);
    await this.profileInfoRepository.save(newProfileInfo);

    // 3. Create profile
    const profile = this.profileRepository.create({
      user,
      assets: newAssets,
      lover: newLover,
      profileInfo: newProfileInfo,
    });

    return await this.profileRepository.save(profile);
  }

  async findAll(findAllProfilesDto: FindAllProfilesDto): Promise<PaginatedResponse<Profile>> {
    const { page = 1, limit = 10, include, search } = findAllProfilesDto;
    const skip = (page - 1) * limit;

    const relations = parseIncludes(include);

    const [data, total] = await this.profileRepository.findAndCount({
      skip,
      take: limit,
      relations: {
          ...relations,
          assets: relations.assets || true,
          lover: relations.lover || true,
          profileInfo: relations.profileInfo || true,
          user: relations.user || true,
      },
      where: search ? {
        profileInfo: {
          name: ILike(`%${search}%`)
        }
      } : {}
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    };
  }

  async findOneByUuid(uuid: string, query?: BaseQueryDto) {
    const relations = parseIncludes(query?.include);
    const profile = await this.profileRepository.findOne({
      where: { uuid },
      relations: {
          ...relations,
          assets: relations.assets || true,
          lover: relations.lover || true,
          profileInfo: relations.profileInfo || true,
          user: relations.user || true,
      },
    });
    if (!profile) throw new NotFoundException('Perfil no encontrado');
    return profile;
  }

  async update(uuid: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOneByUuid(uuid);

    if (updateProfileDto.assets) {
      Object.assign(profile.assets, updateProfileDto.assets);
      await this.assetsRepository.save(profile.assets);
    }

    if (updateProfileDto.lover) {
      Object.assign(profile.lover, updateProfileDto.lover);
      await this.loverRepository.save(profile.lover);
    }

    if (updateProfileDto.profileInfo) {
      Object.assign(profile.profileInfo, updateProfileDto.profileInfo);
      await this.profileInfoRepository.save(profile.profileInfo);
    }

    return await this.profileRepository.save(profile);
  }

  async remove(uuid: string) {
    const profile = await this.findOneByUuid(uuid);
    return await this.profileRepository.remove(profile);
  }
}
