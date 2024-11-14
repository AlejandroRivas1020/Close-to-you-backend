import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createContactDto: CreateContactDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profilePicturePublicId: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      if ('public_id' in result) {
        profilePicturePublicId = result.public_id;
      } else {
        throw new Error('Error uploading image to Cloudinary');
      }
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      userId: user,
      profilePicture: profilePicturePublicId,
    });

    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findOne(filter: {
    email?: string;
    phone?: number;
    name?: string;
  }): Promise<Contact> {
    const query = this.contactRepository.createQueryBuilder('contact');

    if (filter.email) {
      query.orWhere('contact.email = :email', { email: filter.email });
    }
    if (filter.phone) {
      query.orWhere('contact.phone = :phone', { phone: filter.phone });
    }
    if (filter.name) {
      query.orWhere('contact.name = :name', { name: filter.name });
    }

    const contact = await query.getOne();

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    let profilePicturePublicId: string | null = null;
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      if ('public_id' in result) {
        profilePicturePublicId = result.public_id;
      } else {
        throw new Error('Error uploading image to Cloudinary');
      }

      if (contact.profilePicture) {
        await this.cloudinaryService.deleteImage(contact.profilePicture);
      }
    }

    const updatedContact = Object.assign(contact, updateContactDto, {
      profilePicture: profilePicturePublicId ?? contact.profilePicture,
    });

    await this.contactRepository.save(updatedContact);

    return updatedContact;
  }

  async remove(id: string): Promise<void> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (contact.profilePicture) {
      await this.cloudinaryService.deleteImage(contact.profilePicture);
    }

    await this.contactRepository.delete(id);
  }
}
