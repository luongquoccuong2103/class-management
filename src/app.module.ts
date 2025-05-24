import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'typeorm-config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from '@/utils/filters/exception.filter';
import { RegistrationModule } from './modules/registration/registration.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
    }),
    RegistrationModule,
  ],
  controllers: [],
  providers: [
    RegistrationModule,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
