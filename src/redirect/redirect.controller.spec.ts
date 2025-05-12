import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { LinksService } from '../links/links.service';
import { NotFoundException } from '@nestjs/common';

describe('RedirectController', () => {
  let controller: RedirectController;
  let linksService: LinksService;

  const mockLinksService = {
    handleRedirect: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    linksService = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('redirect', () => {
    it('should redirect to original URL', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      mockLinksService.handleRedirect.mockResolvedValue(originalUrl);

      const result = await controller.redirect(shortCode);

      expect(result).toEqual({
        url: originalUrl,
        statusCode: 301,
      });
      expect(linksService.handleRedirect).toHaveBeenCalledWith(shortCode);
    });

    it('should throw NotFoundException for invalid short code', async () => {
      const shortCode = 'invalid';

      mockLinksService.handleRedirect.mockRejectedValue(
        new NotFoundException(`Short link not found`)
      );

      await expect(controller.redirect(shortCode)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});