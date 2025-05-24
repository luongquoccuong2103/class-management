import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Teacher } from '@/databases/entities/teacher.entity';
import { Student } from '@/databases/entities/student.entity';
import { Registration } from '@/databases/entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student, Registration])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
