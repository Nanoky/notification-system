import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRequestUseCaseInput } from 'src/requests/usecases/create-request.usecase';

export class CreateRequestDto implements CreateRequestUseCaseInput {
    @ApiProperty()
    eventType: string;
    @ApiProperty()
    tenantId: string;
    @ApiProperty()
    recipients: string[];
    @ApiProperty()
    payload: Record<string, any>;
    @ApiPropertyOptional()
    scheduledAt?: Date | undefined;
    @ApiPropertyOptional()
    priority?: number | undefined;
    @ApiPropertyOptional()
    idempotencyKey: string;
}
