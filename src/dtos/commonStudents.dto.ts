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
  @IsEmail({}, { each: true })
  teacher: string | string[];
}
