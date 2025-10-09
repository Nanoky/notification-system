/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query } = request;

        const now = Date.now();
        return next.handle().pipe(
            tap(() =>
                this.logger.log(
                    `${method} ${url} - ${Date.now() - now}ms - body: ${JSON.stringify(body)} - query: ${JSON.stringify(query)}`,
                ),
            ),
        );
    }
}
