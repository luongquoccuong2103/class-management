import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from '@/databases/entities/teacher.entity';
import { Student } from '@/databases/entities/student.entity';
import { Registration } from '@/databases/entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Student, Registration])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
