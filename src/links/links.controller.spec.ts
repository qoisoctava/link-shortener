import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

describe('LinksController', () => {
  let controller: LinksController;
  let service: LinksService;

  const mockLinksService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    handleRedirect: jest.fn(),
    getStats: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { userId: 1, email: 'test@example.com' };
  const mockRequest = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    service = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new link', async () => {
      const createDto = { originalUrl: 'https://example.com' };
      const expectedResult = { id: 1, ...createDto, shortCode: 'abc123' };

      mockLinksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  // Update the redirect test to use the new method name and path
  describe('redirectFromApi', () => {
    it('should return redirect object', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      mockLinksService.handleRedirect.mockResolvedValue(originalUrl);

      const result = await controller.redirectFromApi(shortCode);

      expect(result).toEqual({
        url: originalUrl,
        statusCode: 301,
      });
    });
  });

  describe('findAll', () => {
    it('should return all links for the user', async () => {
      const links = [
        { id: 1, originalUrl: 'https://example.com', shortCode: 'abc123' },
        { id: 2, originalUrl: 'https://another.com', shortCode: 'def456' }
      ];

      mockLinksService.findAllByUser.mockResolvedValue(links);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(links);
      expect(service.findAllByUser).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('getStats', () => {
    it('should return link statistics', async () => {
      const linkId = '1';
      const stats = { id: 1, clickCount: 10, originalUrl: 'https://example.com' };

      mockLinksService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats(linkId, mockRequest);

      expect(result).toEqual(stats);
      expect(service.getStats).toHaveBeenCalledWith(+linkId, mockUser.userId);
    });
  });

  describe('update', () => {
    it('should update link', async () => {
      const linkId = '1';
      const updateDto = { originalUrl: 'https://updated.com' };
      const updatedLink = { id: 1, ...updateDto, shortCode: 'abc123' };

      mockLinksService.update.mockResolvedValue(updatedLink);

      const result = await controller.update(linkId, updateDto, mockRequest);

      expect(result).toEqual(updatedLink);
      expect(service.update).toHaveBeenCalledWith(+linkId, updateDto, mockUser.userId);
    });
  });

  describe('remove', () => {
    it('should remove link', async () => {
      const linkId = '1';

      await controller.remove(linkId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(+linkId, mockUser.userId);
    });
  });
});