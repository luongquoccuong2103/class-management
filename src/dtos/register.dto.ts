// src/registrations/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'teacherken@gmail.com' })
  @IsNotEmpty({ message: 'Missing teacher email field' })
  @IsEmail({}, { message: 'Invalid teacher email format' })
  teacher: string;

  @ApiProperty({
    example: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    isArray: true,
  })
  @IsArray({ message: 'Students must be an array of email strings' })
  @ArrayNotEmpty({ message: 'Students array cannot be empty' })
  @ArrayUnique({ message: 'Duplicate emails found in students list' })
  @IsEmail({}, { each: true, message: 'Each student must have a valid email' })
  students: string[];
}
