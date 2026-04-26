import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { Assets } from '../entities/assets.enttity';
import { Lover } from '../entities/lover.entity';
import { ProfileInfo } from '../entities/profileInfo.entity';
import { Users } from 'src/modules/users/entities/user.entity';

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

  async create(createProfileDto: CreateProfileDto) {
    const { userUuid, assets, lover, profileInfo } = createProfileDto;

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

  async findAll() {
    return await this.profileRepository.find({
      relations: ['assets', 'lover', 'profileInfo', 'user'],
    });
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['assets', 'lover', 'profileInfo', 'user'],
    });
    if (!profile) throw new NotFoundException('Perfil no encontrado');
    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);

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

  async remove(id: number) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
