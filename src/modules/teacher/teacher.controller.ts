import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { RegisterDto } from '@/dtos/register.dto';
import { CommonStudentsDto } from '@/dtos/commonStudents.dto';
import { SuspendDto } from '@/dtos/suspend.dto';
import { RetrieveNotificationDto } from '@/dtos/retrieveNotifiocation.dto';

@ApiTags('Teacher')
@Controller('api')
export class TeacherController {
  constructor(private readonly regService: TeacherService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Register one or more students to a teacher' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 204, description: 'Success Request' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.regService.register(dto.teacher, dto.students);
  }

  @Get('commonstudents')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve students common to all given teachers' })
  @ApiQuery({
    name: 'teacher',
    description: 'Email(s) of teacher(s)',
    required: true,
    isArray: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of common students',
    schema: {
      example: {
        students: ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async commonStudents(
    @Query() query: CommonStudentsDto,
  ): Promise<{ students: string | string[] }> {
    const students = await this.regService.findCommon(query.teacher);
    return { students };
  }

  @Post('suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Suspend a specified student' })
  @ApiBody({ type: SuspendDto })
  @ApiResponse({ status: 204, description: 'Student suspended successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async suspend(@Body() dto: SuspendDto): Promise<void> {
    await this.regService.suspendStudent(dto.student);
  }

  @Post('retrievefornotifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve list of students who can receive a given notification',
  })
  @ApiBody({ type: RetrieveNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'List of recipients',
    schema: {
      example: {
        recipients: [
          'studentbob@gmail.com',
          'studentagnes@gmail.com',
          'studentmiche@gmail.com',
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async retrieveForNotifications(
    @Body() dto: RetrieveNotificationDto,
  ): Promise<{ recipients: string[] }> {
    const list = await this.regService.retrieveForNotifications(
      dto.teacher,
      dto.notification,
    );
    return { recipients: list };
  }
}
