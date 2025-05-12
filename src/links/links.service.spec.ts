import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinksService } from './links.service';
import { Link } from './entities/link.entity';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

describe('LinksService', () => {
  let service: LinksService;
  let repository: Repository<Link>;

  // Mock data
  const mockUser = { id: 1, email: 'test@example.com' };
  const mockLink = {
    id: 1,
    originalUrl: 'https://example.com',
    shortCode: 'abc123',
    clickCount: 0,
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    repository = module.get<Repository<Link>>(getRepositoryToken(Link));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create link with auto-generated code', async () => {
      const createDto = { originalUrl: 'https://example.com' };
      
      mockRepository.findOne.mockResolvedValue(null); // No existing link
      mockRepository.create.mockReturnValue(mockLink);
      mockRepository.save.mockResolvedValue(mockLink);

      const result = await service.create(createDto, mockUser as any);

      expect(result).toEqual(mockLink);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create link with custom code', async () => {
      const createDto = { 
        originalUrl: 'https://example.com',
        customShortCode: 'custom123'
      };
      
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...mockLink, shortCode: 'custom123' });
      mockRepository.save.mockResolvedValue({ ...mockLink, shortCode: 'custom123' });

      const result = await service.create(createDto, mockUser as any);

      expect(result.shortCode).toBe('custom123');
    });

    it('should throw ConflictException if custom code exists', async () => {
      const createDto = { 
        originalUrl: 'https://example.com',
        customShortCode: 'existing'
      };
      
      mockRepository.findOne.mockResolvedValue(mockLink); // Code already exists

      await expect(service.create(createDto, mockUser as any))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findAllByUser', () => {
    it('should return user links ordered by creation date', async () => {
      const links = [mockLink, { ...mockLink, id: 2 }];
      mockRepository.find.mockResolvedValue(links);

      const result = await service.findAllByUser(1);

      expect(result).toEqual(links);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('handleRedirect', () => {
    it('should increment click count and return URL', async () => {
      mockRepository.findOne.mockResolvedValue(mockLink);
      mockRepository.save.mockResolvedValue({ ...mockLink, clickCount: 1 });

      const result = await service.handleRedirect('abc123');

      expect(result).toBe(mockLink.originalUrl);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ clickCount: 1 })
      );
    });

    it('should throw NotFoundException for invalid code', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.handleRedirect('invalid'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update link for authorized user', async () => {
      const updateDto = { originalUrl: 'https://updated.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockLink) // For findOne
        .mockResolvedValueOnce(null); // For short code check
      
      mockRepository.save.mockResolvedValue({ ...mockLink, ...updateDto });

      const result = await service.update(1, updateDto, 1);

      expect(result.originalUrl).toBe(updateDto.originalUrl);
    });

    it('should throw ForbiddenException for unauthorized user', async () => {
      mockRepository.findOne.mockResolvedValue(mockLink);

      await expect(service.update(1, {}, 999))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete link for authorized user', async () => {
      mockRepository.findOne.mockResolvedValue(mockLink);
      mockRepository.remove.mockResolvedValue(mockLink);

      await service.remove(1, 1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockLink);
    });

    it('should throw ForbiddenException for unauthorized user', async () => {
      mockRepository.findOne.mockResolvedValue(mockLink);

      await expect(service.remove(1, 999))
        .rejects.toThrow(ForbiddenException);
    });
  });
});