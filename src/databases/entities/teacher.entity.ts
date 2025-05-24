import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Student } from './student.entity';
import { Registration } from './registration.entity';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @ManyToMany(() => Student, (student) => student.teachers)
  @JoinTable({
    name: 'registrations',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students: Student[];

  @OneToMany(() => Registration, (registration) => registration.teacher)
  registrations: Registration[];
}
