import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contact } from '../../contacts/entities/contact.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany(() => Contact, (contact) => contact.userId)
  contacts: Contact[];
}
