import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body } = request;
    const startTime = Date.now();

    const bodyLog = Object.keys(body || {}).length > 0 ? ` Body: ${JSON.stringify(body)}` : '';
    this.logger.log(`--> ${method} ${url}${bodyLog}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(`<-- ${method} ${url} ${response.statusCode} ${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `<-- ${method} ${url} ${error.status || 500} ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
