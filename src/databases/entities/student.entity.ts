import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Registration } from './registration.entity';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'suspended', type: 'boolean', default: false })
  suspended: boolean;

  @ManyToMany(() => Teacher, (teacher) => teacher.students)
  teachers: Teacher[];

  @OneToMany(() => Registration, (registration) => registration.student)
  registrations: Registration[];
}
