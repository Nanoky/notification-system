import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRequestUseCaseInput } from 'src/requests/usecases/create-request.usecase';

export class CreateRequestDto implements CreateRequestUseCaseInput {
    @ApiProperty()
    eventType: string;
    @ApiProperty()
    tenantId: string;
    @ApiProperty()
    recipients: string[];
    @ApiProperty({
        type: 'object',
        additionalProperties: true
    })
    payload: Record<string, any>;
    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time'
    })
    scheduledAt?: Date | undefined;
    @ApiPropertyOptional({
        type: 'number',
        minimum: 0,
        maximum: 10
    })
    priority?: number | undefined;
    @ApiProperty()
    idempotencyKey: string;
}
