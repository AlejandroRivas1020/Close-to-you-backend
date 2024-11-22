import { ApiProperty } from '@nestjs/swagger';
import { UpdateContactDto } from './update-contact.dto';

export class UpdateContactWithFileDto extends UpdateContactDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture of the contact',
    required: false,
  })
  file?: any;
}
