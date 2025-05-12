import { Controller, Get, Param, Redirect, NotFoundException, HttpStatus } from '@nestjs/common';
import { LinksService } from '../links/links.service';

@Controller()
export class RedirectController {
  constructor(private readonly linksService: LinksService) {}

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    try {
      const originalUrl = await this.linksService.handleRedirect(shortCode);
      return { url: originalUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
    } catch (error) {
      // If it's not a valid short link, we should let other routes handle it
      if (error instanceof NotFoundException) {
        // Re-throw to be handled by NestJS exception filter
        throw new NotFoundException(`Short link '${shortCode}' not found`);
      }
      throw error;
    }
  }
}