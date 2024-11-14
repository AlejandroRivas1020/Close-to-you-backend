import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactType } from '../enum/contact-type.enum';
import { User } from 'src/users/entities/user.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'int' })
  phone: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'contact_type',
  })
  contactType: ContactType;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'text', nullable: true, name: 'profile_picture' })
  profilePicture: string;

  // Relación con User
  @ManyToOne(() => User, (user) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_Id' })
  userId: User;
}
