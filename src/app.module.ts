import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'typeorm-config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/utils/filters/exception.filter';
import { TeacherModule } from './modules/teacher/teacher.module';
import { LoggingModule } from './utils/modules/logging.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
    }),
    TeacherModule,
    LoggingModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
