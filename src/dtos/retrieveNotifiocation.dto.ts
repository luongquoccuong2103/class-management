import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RetrieveNotificationDto {
  @ApiProperty({ example: 'teacherken@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty({
    example: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
  })
  @IsNotEmpty()
  notification: string;
}
