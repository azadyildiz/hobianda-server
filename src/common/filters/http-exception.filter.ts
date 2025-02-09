import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * Global Exception Filter to handle all HTTP exceptions.
 * It catches exceptions thrown in the application and returns a standardized response.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Switch to the HTTP context to access the response object.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Determine the status code (default to 500 if not an HttpException)
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract the error message.
    // For HttpException, the response can be an object or a string.
    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';

    // Return the error response in the standardized format.
    response.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}
