
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
import { BusinessRuleViolationError } from '../errors/business-rule-violation.error';
import { DomainError } from '../errors/domain.error';
import { ValidationError } from '../errors/validation.error';

@Catch()
export class DomainErrorFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) { }
    private logError(params: {
        apiUrl: string;
        status: number;
        code?: string;
        message: string | object;
    }): Promise<void> {
        this.logger.error(`${params.apiUrl} - ${params.status} - ${params.code ? params.code + ': ' : ''}${JSON.stringify(params.message)}`, {
            ...params
        });

        return Promise.resolve();
    }
    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const url: string = (ctx.getRequest() as Request).url;

        if (exception instanceof DomainError) {
            let status = HttpStatus.INTERNAL_SERVER_ERROR;

            if (exception instanceof ValidationError) {
                status = HttpStatus.BAD_REQUEST;
            } else if (exception instanceof NotFoundError) {
                status = HttpStatus.NOT_FOUND;
            } else if (exception instanceof BusinessRuleViolationError) {
                status = HttpStatus.UNPROCESSABLE_ENTITY;
            }

            await this.logError({
                apiUrl: url,
                status: status,
                code: exception.code,
                message: exception.message,
            });
            return res.status(status).json({
                statusCode: status,
                error: exception.code,
                message: exception.message,
            });
        }

        // Autres erreurs (non prévues)
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const message = exception.getResponse();

            await this.logError({
                apiUrl: url,
                status: status,
                message: message,
            });
            return res.status(status).json(message);
        }

        if (exception instanceof Error) {
            await this.logError({
                apiUrl: url,
                status: 500,
                message: exception.message,
            });
            return res.status(500).json({
                statusCode: 500,
                message: exception.message ?? 'Internal server error',
            });
        }

        await this.logError({
            apiUrl: url,
            status: 500,
            message: `Internal server error`,
        })
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}
