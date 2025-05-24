// src/entities/registration.entity.ts
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity({ name: 'registrations' })
export class Registration {
  @PrimaryColumn({ name: 'teacher_id', type: 'int' })
  teacherId: number;

  @PrimaryColumn({ name: 'student_id', type: 'int' })
  studentId: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
