import { IsUrl, IsOptional, IsString, Matches, Length } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'Custom link must be between 3-20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Custom link can only contain letters, numbers, underscores, and hyphens',
  })
  customShortCode?: string;
}