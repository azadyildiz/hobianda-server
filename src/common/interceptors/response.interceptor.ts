import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global Response Interceptor
 *
 * This interceptor ensures that all responses follow the same structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any
 * }
 *
 * If the response from a service is already in this format, it is returned as is.
 * Otherwise, it wraps the raw data with default values.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { success: boolean; message: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<{ success: boolean; message: string; data: T }> {
    return next.handle().pipe(
      map((data) => {
        // If the response already has our structure, return it directly.
        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          return {
            success: true,
            message: data.message,
            data: data.data,
          } as { success: boolean; message: string; data: T };
        }
        // Otherwise, wrap the data with default success values.
        return { success: true, message: 'Success', data };
      })
    );
  }
}
