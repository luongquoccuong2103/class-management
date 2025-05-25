// src/registrations/dto/common-students.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';

export class CommonStudentsDto {
  @ApiProperty({
    description: 'One or more teacher email addresses',
    example: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
    type: [String],
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray({ message: 'teacher query parameter must be an array' })
  @ArrayNotEmpty({ message: 'At least one teacher email is required' })
  @IsEmail({}, { each: true, message: 'Each teacher email must be valid' })
  teacher: string[];
}
