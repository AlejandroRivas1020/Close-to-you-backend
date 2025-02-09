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
  @IsString()
  @IsNotEmpty()
  phone: string;

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
}
