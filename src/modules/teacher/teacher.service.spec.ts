import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from '@/databases/entities/teacher.entity';
import { Student } from '@/databases/entities/student.entity';
import { Registration } from '@/databases/entities/registration.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepo: Repository<Teacher>;
  let studentRepo: Repository<Student>;
  let regRepo: Repository<Registration>;

  const mockTeacherRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStudentRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRegRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepo,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepo,
        },
        {
          provide: getRepositoryToken(Registration),
          useValue: mockRegRepo,
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepo = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    regRepo = module.get<Repository<Registration>>(
      getRepositoryToken(Registration),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const teacherEmail = 'teacher@example.com';
    const studentEmails = ['student1@example.com', 'student2@example.com'];

    it('should throw NotFoundException when teacher not found', async () => {
      mockTeacherRepo.findOne.mockResolvedValue(null);

      await expect(
        service.register(teacherEmail, studentEmails),
      ).rejects.toThrow(NotFoundException);
    });

    it('should register students to teacher successfully', async () => {
      const mockTeacher = { id: 1, email: teacherEmail };
      const mockStudents = studentEmails.map((email, index) => ({
        id: index + 1,
        email,
        suspended: false,
      }));

      mockTeacherRepo.findOne.mockResolvedValue(mockTeacher);
      mockStudentRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockStudentRepo.create.mockImplementation((dto) => dto);
      mockStudentRepo.save.mockImplementation((student) =>
        Promise.resolve({ ...student, id: 1 }),
      );
      mockRegRepo.findOne.mockResolvedValue(null);
      mockRegRepo.create.mockImplementation((dto) => dto);
      mockRegRepo.save.mockImplementation((reg) => Promise.resolve(reg));

      await service.register(teacherEmail, studentEmails);

      expect(mockTeacherRepo.findOne).toHaveBeenCalledWith({
        where: { email: teacherEmail },
      });
      expect(mockStudentRepo.create).toHaveBeenCalledTimes(2);
      expect(mockStudentRepo.save).toHaveBeenCalledTimes(2);
      expect(mockRegRepo.create).toHaveBeenCalledTimes(2);
      expect(mockRegRepo.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('findCommon', () => {
    it('should return empty array for empty teacher emails', async () => {
      const result = await service.findCommon([]);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when no teachers found', async () => {
      mockTeacherRepo.find.mockResolvedValue([]);
      await expect(service.findCommon(['teacher@example.com'])).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return common students for multiple teachers', async () => {
      const mockTeachers = [
        {
          id: 1,
          email: 'teacher1@example.com',
          students: [
            { email: 'common@example.com' },
            { email: 'student1@example.com' },
          ],
        },
        {
          id: 2,
          email: 'teacher2@example.com',
          students: [
            { email: 'common@example.com' },
            { email: 'student2@example.com' },
          ],
        },
      ];

      mockTeacherRepo.find.mockResolvedValue(mockTeachers);

      const result = await service.findCommon([
        'teacher1@example.com',
        'teacher2@example.com',
      ]);

      expect(result).toEqual(['common@example.com']);
    });
  });

  describe('suspendStudent', () => {
    const studentEmail = 'student@example.com';

    it('should throw NotFoundException when student not found', async () => {
      mockStudentRepo.findOne.mockResolvedValue(null);

      await expect(service.suspendStudent(studentEmail)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should suspend student successfully', async () => {
      const mockStudent = { id: 1, email: studentEmail, suspended: false };
      mockStudentRepo.findOne.mockResolvedValue(mockStudent);
      mockStudentRepo.save.mockImplementation((student) =>
        Promise.resolve(student),
      );

      await service.suspendStudent(studentEmail);

      expect(mockStudentRepo.save).toHaveBeenCalledWith({
        ...mockStudent,
        suspended: true,
      });
    });
  });

  describe('retrieveForNotifications', () => {
    const teacherEmail = 'teacher@example.com';
    const notification = 'Hello @student1@example.com @student2@example.com';

    it('should throw NotFoundException when teacher not found', async () => {
      mockTeacherRepo.findOne.mockResolvedValue(null);

      await expect(
        service.retrieveForNotifications(teacherEmail, notification),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return list of notification recipients', async () => {
      const mockTeacher = {
        id: 1,
        email: teacherEmail,
        students: [
          { email: 'student1@example.com', suspended: false },
          { email: 'student2@example.com', suspended: true },
          { email: 'student3@example.com', suspended: false },
        ],
      };

      const mockMentionedStudents = [
        { email: 'student1@example.com', suspended: false },
        { email: 'student4@example.com', suspended: false },
      ];

      mockTeacherRepo.findOne.mockResolvedValue(mockTeacher);
      mockStudentRepo.find.mockResolvedValue(mockMentionedStudents);

      const result = await service.retrieveForNotifications(
        teacherEmail,
        notification,
      );

      expect(result).toContain('student1@example.com');
      expect(result).toContain('student3@example.com');
      expect(result).toContain('student4@example.com');
      expect(result).not.toContain('student2@example.com'); // suspended student
      expect(mockTeacherRepo.findOne).toHaveBeenCalledWith({
        where: { email: teacherEmail },
        relations: ['students'],
      });
    });
  });
});
