import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Exception Filter to handle known Prisma exceptions globally.
 * This filter catches Prisma errors (e.g., unique constraint violations) and returns
 * a custom, user-friendly error response.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    // Switch to the HTTP context to access the response object.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default status and message values.
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    // Customize error responses based on the specific Prisma error code.
    switch (exception.code) {
      case 'P2002':
        // Unique constraint failed error
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed on field: ${(exception.meta?.target as string[])?.join(', ')}`;
        break;
      case 'P2003':
        // Foreign key constraint failed error
        status = HttpStatus.BAD_REQUEST;
        message = `Foreign key constraint failed`;
        break;
      case 'P2025':
        // Record not found error
        status = HttpStatus.NOT_FOUND;
        message = `Record not found`;
        break;
      default:
        // For all other cases, use the default exception message.
        message = exception.message;
        break;
    }

    // Return the standardized error response.
    response.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}
