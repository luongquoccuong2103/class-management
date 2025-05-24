import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { RegisterDto } from '@/dtos/register.dto';

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
}
