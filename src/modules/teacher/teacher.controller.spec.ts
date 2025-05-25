import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { RegisterDto } from '@/dtos/register.dto';
import { SuspendDto } from '@/dtos/suspend.dto';
import { RetrieveNotificationDto } from '@/dtos/retrieveNotifiocation.dto';
import { CommonStudentsDto } from '@/dtos/commonStudents.dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  let service: TeacherService;

  const mockTeacherService = {
    register: jest.fn(),
    findCommon: jest.fn(),
    suspendStudent: jest.fn(),
    retrieveForNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: mockTeacherService,
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    service = module.get<TeacherService>(TeacherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call service.register with correct parameters', async () => {
      const dto: RegisterDto = {
        teacher: 'teacher@example.com',
        students: ['student1@example.com', 'student2@example.com'],
      };

      await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto.teacher, dto.students);
    });
  });

  describe('commonStudents', () => {
    it('should call service.findCommon and return students array', async () => {
      const query: CommonStudentsDto = {
        teacher: ['teacher1@example.com', 'teacher2@example.com'],
      };
      const mockStudents = ['common@example.com'];
      mockTeacherService.findCommon.mockResolvedValue(mockStudents);

      const result = await controller.commonStudents(query);

      expect(service.findCommon).toHaveBeenCalledWith(query.teacher);
      expect(result).toEqual({ students: mockStudents });
    });
  });

  describe('suspend', () => {
    it('should call service.suspendStudent with correct email', async () => {
      const dto: SuspendDto = {
        student: 'student@example.com',
      };

      await controller.suspend(dto);

      expect(service.suspendStudent).toHaveBeenCalledWith(dto.student);
    });
  });

  describe('retrieveForNotifications', () => {
    it('should call service.retrieveForNotifications and return recipients array', async () => {
      const dto: RetrieveNotificationDto = {
        teacher: 'teacher@example.com',
        notification: 'Hello @student1@example.com',
      };
      const mockRecipients = ['student1@example.com', 'student2@example.com'];
      mockTeacherService.retrieveForNotifications.mockResolvedValue(
        mockRecipients,
      );

      const result = await controller.retrieveForNotifications(dto);

      expect(service.retrieveForNotifications).toHaveBeenCalledWith(
        dto.teacher,
        dto.notification,
      );
      expect(result).toEqual({ recipients: mockRecipients });
    });
  });
});
