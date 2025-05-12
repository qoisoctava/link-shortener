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

  describe('redirect', () => {
    it('should return redirect object', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      mockLinksService.handleRedirect.mockResolvedValue(originalUrl);

      const result = await controller.redirect(shortCode);

      expect(result).toEqual({
        url: originalUrl,
        statusCode: 301,
      });
    });
  });
});