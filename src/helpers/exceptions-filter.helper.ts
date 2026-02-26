import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response, Request } from 'express';
import moment from 'moment';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string = '';
    let error: string = '';

    // Note: I18nValidationException is handled by I18nValidationExceptionFilter
    // which is registered as a more specific filter and executes first

    if (exception instanceof BadRequestException) {
      // Handle NestJS ValidationPipe errors
      status = exception.getStatus();
      error = 'Bad Request';
      const errorResponse = exception.getResponse();
      message = this.extractValidationMessage((errorResponse as any).message);
    } else if (exception instanceof HttpException) {
      // Handle other HTTP exceptions
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const extractedMessage = (errorResponse as any).message;
        message = Array.isArray(extractedMessage) ? extractedMessage[0] : extractedMessage;
        error = (errorResponse as any)?.error || 'Bad Request';
      }
    } else {
      // Handle unknown/internal server errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Oops! Something went wrong. Please try again later.';
      error = 'Internal Server Error';
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      path: request.url,
    });
  }

  private extractValidationMessage(errors: any): string {
    console.log({ errors });

    if (Array.isArray(errors) && errors.length) {
      return errors[0];
    }
    return errors;
  }
}
