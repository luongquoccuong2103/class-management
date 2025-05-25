import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const res = exception.getResponse();

    let message: string | string[];
    if (typeof res === 'object' && (res as any).message) {
      message = (res as any).message;
    } else {
      message = exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
