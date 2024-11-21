import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/express-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully.',
    type: Contact,
  })
  async create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Contact> {
    const userId = req.user.userId;
    return await this.contactService.create(createContactDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all contacts' })
  @ApiResponse({
    status: 200,
    description: 'List of all contacts.',
    type: [Contact],
  })
  async findAll(@Req() req: AuthenticatedRequest): Promise<Contact[]> {
    const userId = req.user.userId;
    return await this.contactService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Find a contact by email, phone, or name' })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Email of the contact',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Phone number of the contact',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Name of the contact',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact found based on search criteria.',
    type: Contact,
  })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('name') name?: string,
  ): Promise<Contact> {
    const userId = req.user.userId;
    const filter = {
      email: email || undefined,
      phone: phone || undefined,
      name: name || undefined,
    };

    return await this.contactService.findOne(filter, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiParam({ name: 'id', description: 'ID of the contact to update' })
  @ApiResponse({
    status: 200,
    description: 'Contact updated successfully.',
    type: Contact,
  })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return await this.contactService.update(id, updateContactDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiParam({ name: 'id', description: 'ID of the contact to delete' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.contactService.remove(id);
  }
}
