import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}

  private generateShortCode(length: number = 5) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  async create(createLinkDto: CreateLinkDto, user: User): Promise<any> {
    let shortCode = createLinkDto.customShortCode;
  
    if (!shortCode) {
      do {
        shortCode = this.generateShortCode();
      } while (await this.findByShortCode(shortCode));
    } else {
      const existingLink = await this.findByShortCode(shortCode);
      if (existingLink) {
        throw new ConflictException('Short code already exists');
      }
    }
  
    const link = this.linksRepository.create({
      originalUrl: createLinkDto.originalUrl,
      shortCode,
      user,
    });
  
    const savedLink = await this.linksRepository.save(link);
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return {
      ...savedLink,
      fullShortUrl: `${baseUrl}/${savedLink.shortCode}`
    };
  }

  async findAllByUser(UserId: number): Promise<Link[]> {
    return this.linksRepository.find({
      where: { user: { id: UserId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Link> {
    const link = await this.linksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!link) {
      throw new NotFoundException(`Link ${id} not found!`);
    }

    return link;
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    return this.linksRepository.findOne({
      where: { shortCode },
    });
  }

  async handleRedirect(shortCode: string): Promise<string> {
    const link = await this.findByShortCode(shortCode);

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    link.clickCount++;
    await this.linksRepository.save(link);

    return link.originalUrl;
  }

  async update(
    id: number,
    updateLinkDto: UpdateLinkDto,
    userId: number,
  ): Promise<Link> {
    const link = await this.findOne(id);

    // Check ownership
    if (link.user.id !== userId) {
      throw new ForbiddenException('You can only update your own links');
    }

    // If updating short code, check for conflicts
    if (
      updateLinkDto.customShortCode &&
      updateLinkDto.customShortCode !== link.shortCode
    ) {
      const existingLink = await this.findByShortCode(
        updateLinkDto.customShortCode,
      );
      if (existingLink) {
        throw new ConflictException('Short code already exists');
      }
      link.shortCode = updateLinkDto.customShortCode;
    }

    // Update original URL if provided
    if (updateLinkDto.originalUrl) {
      link.originalUrl = updateLinkDto.originalUrl;
    }

    return this.linksRepository.save(link);
  }

  async remove(id: number, userId: number): Promise<void> {
    const link = await this.findOne(id);

    // Check ownership
    if (link.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own links');
    }

    await this.linksRepository.remove(link);
  }

  async getStats(id: number, userId: number): Promise<Link> {
    const link = await this.findOne(id);

    // Check ownership
    if (link.user.id !== userId) {
      throw new ForbiddenException(
        'You can only view stats for your own links',
      );
    }

    return link;
  }
}
