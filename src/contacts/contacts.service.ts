import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { User } from 'src/users/entities/user.entity'; // Asegúrate de importar la entidad User

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createContactDto: CreateContactDto,
    userId: string,
  ): Promise<Contact> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      userId: user,
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
  ): Promise<Contact> {
    await this.contactRepository.update(id, updateContactDto);
    const updatedContact = await this.contactRepository.findOne({
      where: { id },
    });
    if (!updatedContact) {
      throw new NotFoundException('Contact not found');
    }
    return updatedContact;
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contact not found');
    }
  }
}
