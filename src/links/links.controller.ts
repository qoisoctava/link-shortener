import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Redirect, Request, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  //Create new shortlink
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createLinkDto: CreateLinkDto, @Request() req) {
    return this.linksService.create(createLinkDto, req.user);
  }

  //Get all links for user
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req){
    return this.linksService.findAllByUser(req.linksService.userId)
  }

  //Redirect to original link
  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string){
    const originalUrl = await this.linksService.handleRedirect(shortCode)
    return { url: originalUrl, statusCode: HttpStatus.MOVED_PERMANENTLY };
  }

  //Get link statistics
  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Param('id') id: string, @Request() req){
    return this.linksService.getStats(+id, req.user.userId)
  }

  //Update a link
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
    @Request() req
  ){
    return this.linksService.update(+id,updateLinkDto,req.user.userId)
  }

  //Delete link
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.linksService.remove(+id, req.user.userId);
  }

}
