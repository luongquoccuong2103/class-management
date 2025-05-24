import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'typeorm-config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@/utils/filters/exception.filter';
import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
    }),
    TeacherModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
