import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Delete, 
    Put,
    UseGuards, 
    Request,
    Redirect,
    HttpCode,
    HttpStatus
  } from '@nestjs/common';
  import { LinksService } from './links.service';
  import { CreateLinkDto } from './dto/create-link.dto';
  import { UpdateLinkDto } from './dto/update-link.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('links')
  export class LinksController {
    constructor(private readonly linksService: LinksService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createLinkDto: CreateLinkDto, @Request() req) {
      return this.linksService.create(createLinkDto, req.user);
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req) {
      return this.linksService.findAllByUser(req.user.userId);
    }

    @Get(':shortCode/redirect')
    @Redirect()
    async redirectFromApi(@Param('shortCode') shortCode: string) {
      const originalUrl = await this.linksService.handleRedirect(shortCode);
      return { url: originalUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
    }
  
    @Get(':id/stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@Param('id') id: string, @Request() req) {
      return this.linksService.getStats(+id, req.user.userId);
    }
  
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
      @Param('id') id: string,
      @Body() updateLinkDto: UpdateLinkDto,
      @Request() req
    ) {
      return this.linksService.update(+id, updateLinkDto, req.user.userId);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Request() req) {
      await this.linksService.remove(+id, req.user.userId);
    }
  }