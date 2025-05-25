import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendDto {
  @ApiProperty({ example: 'studentmary@gmail.com' })
  @IsNotEmpty({ message: 'Missing student email field' })
  @IsEmail({}, { message: 'Invalid student email format' })
  student: string;
}
