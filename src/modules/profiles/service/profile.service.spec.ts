import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '../entities/profile.entity';
import { Assets } from '../entities/assets.enttity';
import { Lover } from '../entities/lover.entity';
import { ProfileInfo } from '../entities/profileInfo.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { mockRepository } from 'src/common/utils/test.utils';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: any;
  let assetsRepository: any;
  let loverRepository: any;
  let profileInfoRepository: any;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Assets),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Lover),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ProfileInfo),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(getRepositoryToken(Profile));
    assetsRepository = module.get(getRepositoryToken(Assets));
    loverRepository = module.get(getRepositoryToken(Lover));
    profileInfoRepository = module.get(getRepositoryToken(ProfileInfo));
    userRepository = module.get(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      assets: { avatar: 'url' },
      lover: { name: 'test lover' },
      profileInfo: { name: 'test profile', nationality: 'Testland', race: 'Human' },
    } as any;

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.create('user-uuid', createDto)).rejects.toThrow(NotFoundException);
    });

    it('should create and save profile with related entities', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1, uuid: 'user-uuid' });
      
      const newAssets = { id: 1 };
      const newLover = { id: 1 };
      const newProfileInfo = { id: 1 };
      
      assetsRepository.create.mockReturnValue(newAssets);
      loverRepository.create.mockReturnValue(newLover);
      profileInfoRepository.create.mockReturnValue(newProfileInfo);
      
      const createdProfile = { id: 1, user: { id: 1 } };
      profileRepository.create.mockReturnValue(createdProfile);
      profileRepository.save.mockResolvedValue(createdProfile);

      const result = await service.create('user-uuid', createDto);

      expect(assetsRepository.save).toHaveBeenCalledWith(newAssets);
      expect(loverRepository.save).toHaveBeenCalledWith(newLover);
      expect(profileInfoRepository.save).toHaveBeenCalledWith(newProfileInfo);
      expect(profileRepository.save).toHaveBeenCalledWith(createdProfile);
      expect(result).toEqual(createdProfile);
    });
  });

  describe('findAll', () => {
    it('should return paginated profiles', async () => {
      const profiles = [{ id: 1 }];
      profileRepository.findAndCount.mockResolvedValue([profiles, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(profiles);
      expect(result.meta.total).toBe(1);
    });

    it('should handle search query', async () => {
      profileRepository.findAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ page: 1, limit: 10, search: 'test' });
      
      expect(profileRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            profileInfo: expect.objectContaining({
              name: expect.anything()
            })
          })
        })
      );
    });
  });

  describe('findOneByUuid', () => {
    it('should return profile if found', async () => {
      const profile = { uuid: 'profile-uuid' };
      profileRepository.findOne.mockResolvedValue(profile);

      const result = await service.findOneByUuid('profile-uuid');
      expect(result).toEqual(profile);
    });

    it('should throw NotFoundException if not found', async () => {
      profileRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('profile-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update related entities', async () => {
      const profile = { 
        id: 1, 
        uuid: 'profile-uuid', 
        assets: { id: 1 }, 
        lover: { id: 1 }, 
        profileInfo: { id: 1 } 
      };
      profileRepository.findOne.mockResolvedValue(profile);
      profileRepository.save.mockResolvedValue(profile);

      const updateDto = {
        assets: { avatar: 'new-url' },
        lover: { partnerUuid: 'new-partner' },
        profileInfo: { name: 'New Name' }
      };

      await service.update('profile-uuid', updateDto);

      expect(assetsRepository.save).toHaveBeenCalledWith(expect.objectContaining({ avatar: 'new-url' }));
      expect(loverRepository.save).toHaveBeenCalledWith(expect.objectContaining({ partnerUuid: 'new-partner' }));
      expect(profileInfoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }));
      expect(profileRepository.save).toHaveBeenCalledWith(profile);
    });
  });

  describe('remove', () => {
    it('should remove profile', async () => {
      const profile = { uuid: 'profile-uuid' };
      profileRepository.findOne.mockResolvedValue(profile);
      profileRepository.remove.mockResolvedValue(profile);

      await service.remove('profile-uuid');
      expect(profileRepository.remove).toHaveBeenCalledWith(profile);
    });
  });
});
