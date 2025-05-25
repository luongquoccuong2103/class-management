import { Registration } from '@/databases/entities/registration.entity';
import { Student } from '@/databases/entities/student.entity';
import { Teacher } from '@/databases/entities/teacher.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LoggerService } from '@/utils/services/logger.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    private readonly logger: LoggerService,
  ) {
    this.logger = new LoggerService(TeacherService.name);
  }

  async register(teacherEmail: string, studentEmails: string[]): Promise<void> {
    try {
      // 1. Find teacher
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

      // 3. Insert registrations
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
    } catch (error) {
      this.logger.logError(error, {
        operation: 'register',
        teacherEmail,
        studentEmails,
      });
      throw error;
    }
  }

  async findCommon(teacherEmails: string | string[]): Promise<string[]> {
    try {
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
    } catch (error) {
      this.logger.logError(error, {
        operation: 'findCommon',
        teacherEmails,
      });
      throw error;
    }
  }

  async suspendStudent(studentEmail: string): Promise<void> {
    try {
      const student = await this.studentRepo.findOne({
        where: { email: studentEmail },
      });
      if (!student) {
        throw new NotFoundException(
          `Student with email "${studentEmail}" not found`,
        );
      }

      student.suspended = true;
      await this.studentRepo.save(student);
    } catch (error) {
      this.logger.logError(error, {
        operation: 'suspendStudent',
        studentEmail,
      });
      throw error;
    }
  }

  async retrieveForNotifications(
    teacherEmail: string,
    notification: string,
  ): Promise<string[]> {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: { email: teacherEmail },
        relations: ['students'],
      });
      if (!teacher) {
        throw new NotFoundException(`Teacher "${teacherEmail}" not found`);
      }

      const registeredEmails = teacher.students
        .filter((s) => !s.suspended)
        .map((s) => s.email);

      const mentionedEmails = new Set<string>();
      const regex = /@([\w.+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(notification))) {
        mentionedEmails.add(match[1]);
      }

      let validMentioned: string[] = [];
      if (mentionedEmails.size > 0) {
        const rows = await this.studentRepo.find({
          where: {
            email: In(Array.from(mentionedEmails)),
            suspended: false,
          },
        });
        validMentioned = rows.map((s) => s.email);
      }

      const recipientsSet = new Set<string>(registeredEmails);
      for (const e of validMentioned) {
        recipientsSet.add(e);
      }

      const recipients = Array.from(recipientsSet);
      return recipients;
    } catch (error) {
      this.logger.logError(error, {
        operation: 'retrieveForNotifications',
        teacherEmail,
      });
      throw error;
    }
  }
}
