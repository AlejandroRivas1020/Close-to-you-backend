import { ApiProperty } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';

export class CreateContactWithFileDto extends CreateContactDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture of the contact',
    required: false,
  })
  file?: any;
}
