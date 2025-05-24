import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendDto {
  @ApiProperty({ example: 'studentmary@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  student: string;
}
