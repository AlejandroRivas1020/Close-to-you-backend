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

    let profilePictureUrl: string | null = null;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);

      if (result?.secure_url) {
        profilePictureUrl = result.secure_url;
      } else {
        throw new Error('Error: secure_url not found in Cloudinary response');
      }
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      profilePicture: profilePictureUrl,
      userId: user,
    });

    return await this.contactRepository.save(contact);
  }

  async findAll(userId: string): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { userId: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(
    filter: {
      email?: string;
      phone?: string;
      name?: string;
    },
    userId: string,
  ): Promise<Contact> {
    const query = this.contactRepository.createQueryBuilder('contact');
    query.where('contact.userId = :userId', { userId });

    if (filter.email) {
      query.andWhere('contact.email = :email', { email: filter.email });
    }
    if (filter.phone) {
      query.andWhere('contact.phone = :phone', { phone: filter.phone });
    }
    if (filter.name) {
      query.andWhere('contact.name = :name', { name: filter.name });
    }

    query.orderBy('contact.name', 'ASC');

    const contact = await query.getOne();

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, userId: { id: userId } },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    let profilePictureUrl: string | null = contact.profilePicture;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);

      if (result?.secure_url) {
        profilePictureUrl = result.secure_url;

        if (contact.profilePicture) {
          await this.cloudinaryService.deleteImage(contact.profilePicture);
        }
      } else {
        throw new Error('Error: secure_url not found in Cloudinary response');
      }
    }

    const updatedContact = Object.assign(contact, updateContactDto, {
      profilePicture: profilePictureUrl,
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

  async findById(id: string, userId: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: {
        id,
        userId: { id: userId },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }
}
