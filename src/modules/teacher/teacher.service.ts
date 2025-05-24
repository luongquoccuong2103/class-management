import { Registration } from '@/databases/entities/registration.entity';
import { Student } from '@/databases/entities/student.entity';
import { Teacher } from '@/databases/entities/teacher.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
  ) {}

  async register(teacherEmail: string, studentEmails: string[]): Promise<void> {
    // 1. Upsert teacher
    const teacher = await this.teacherRepo.findOne({
      where: { email: teacherEmail },
    });
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with email "${teacherEmail}" not found`,
      );
    }

    // 2. Upsert students
    const students: Student[] = [];
    for (const email of studentEmails) {
      let student = await this.studentRepo.findOne({ where: { email } });
      if (!student) {
        student = this.studentRepo.create({ email, suspended: false });
        student = await this.studentRepo.save(student);
      }
      students.push(student);
    }

    // 3. Insert into registrations if not exists
    for (const student of students) {
      const exists = await this.regRepo.findOne({
        where: { teacherId: teacher.id, studentId: student.id },
      });
      if (!exists) {
        const reg = this.regRepo.create({
          teacherId: teacher.id,
          studentId: student.id,
        });
        await this.regRepo.save(reg);
      }
    }
  }

  async findCommon(teacherEmails: string | string[]): Promise<string[]> {
    const emails = Array.isArray(teacherEmails)
      ? teacherEmails
      : [teacherEmails];

    if (emails.length === 0) {
      return [];
    }

    const teachers = await this.teacherRepo.find({
      where: { email: In(emails) },
      relations: ['students'],
    });

    if (teachers.length === 0) {
      throw new NotFoundException('No teachers found for given emails');
    }

    const listOfEmailArrays = teachers.map((t) =>
      t.students.map((s) => s.email),
    );

    const commonEmails = listOfEmailArrays.reduce(
      (acc, curr) => acc.filter((email) => curr.includes(email)),
      listOfEmailArrays[0],
    );

    return commonEmails;
  }
}
