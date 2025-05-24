import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { RegisterDto } from '@/dtos/register.dto';

@ApiTags('Registration')
@Controller('api')
export class RegistrationController {
  constructor(private readonly regService: RegistrationService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Register one or more students to a teacher' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.regService.register(dto.teacher, dto.students);
  }
}
