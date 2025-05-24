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
  @IsEmail()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty({
    example: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEmail({}, { each: true })
  students: string[];
}
