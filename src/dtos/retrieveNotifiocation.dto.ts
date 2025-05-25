import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RetrieveNotificationDto {
  @ApiProperty({ example: 'teacherken@gmail.com' })
  @IsNotEmpty({ message: 'Missing teacher email field' })
  @IsEmail({}, { message: 'Invalid teacher email format' })
  teacher: string;

  @ApiProperty({
    example: 'Hello @studentagnes@gmail.com',
  })
  @IsNotEmpty({ message: 'Missing notification text' })
  notification: string;
}
