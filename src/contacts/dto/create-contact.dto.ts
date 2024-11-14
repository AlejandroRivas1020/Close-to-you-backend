import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactType } from '../enum/contact-type.enum';

export class CreateContactDto {
  @ApiProperty({ description: 'Name of the contact', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the contact',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the contact',
    example: 123456789,
  })
  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @ApiProperty({
    description: 'Type of contact',
    enum: ContactType,
    required: false,
  })
  @IsString()
  @IsOptional()
  contactType?: ContactType;

  @ApiProperty({
    description: 'Longitude of the contact location',
    example: -73.935242,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Latitude of the contact location',
    example: 40.73061,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'URL of the contact profile picture',
    example: 'http://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}
