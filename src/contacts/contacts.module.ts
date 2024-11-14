import { Module } from '@nestjs/common';
import { ContactService } from './contacts.service';
import { ContactController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, User]), AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactsModule {}
