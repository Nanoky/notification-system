import { Executable } from "src/shared/core/executable.interface";
import { ValidationError } from "src/shared/errors/validation.error";
import { IFindByIdempotencyKeyRepository, IGenerateRequestIdRepository, IPublishRequestRepository, ISaveRequestRepository } from "../domain/ports/request.repository";
import { IFindByIdTenantRepository } from "../domain/ports/tenant.repository";
import { isNullOrUndefined } from "src/shared/utils/common";
import { IEventAvailabilityRepository } from "../domain/ports/event.repository";
import { NotificationRequest } from "../domain/models/request.model";


export interface CreateRequestUseCaseInput {
    eventType: string;
    tenantId: string;
    recipients: string[];
    payload: Record<string, any>;
    scheduledAt?: Date;
    priority?: number;
    idempotencyKey: string;
}

export type CreateRequestUseCaseOutput = void;

export class CreateRequestUseCase implements Executable<CreateRequestUseCaseInput, CreateRequestUseCaseOutput> {
    constructor(
        private readonly tenantRepository: IFindByIdTenantRepository,
        private readonly eventRepository: IEventAvailabilityRepository,
        private readonly requestRepository: ISaveRequestRepository & IGenerateRequestIdRepository & IFindByIdempotencyKeyRepository,
        private readonly publisher: IPublishRequestRepository
    ) { }
    async execute(params: CreateRequestUseCaseInput): Promise<void> {

        const requestDto = await this.requestRepository.findByIdempotencyKey(params.idempotencyKey);
        if (requestDto) {
            throw new ValidationError("Idempotency key already exists")
        }

        const tenantDTO = await this.tenantRepository.findById(params.tenantId);
        if (isNullOrUndefined(tenantDTO)) {
            throw new ValidationError("Tenant not found")
        }

        const isEventAvailable = await this.eventRepository.isEventAvailable({
            eventType: params.eventType,
            tenantId: tenantDTO.id
        });
        if (!isEventAvailable) {
            throw new ValidationError("Event type not available")
        }

        const id = await this.requestRepository.generateRequestId();
        const request: NotificationRequest = {
            id: id,
            tenantId: params.tenantId,
            eventType: params.eventType,
            recipients: params.recipients,
            payload: params.payload,
            status: "PENDING",
            scheduledAt: params.scheduledAt,
            priority: params.priority,
            createdAt: new Date(),
            idempotencyKey: params.idempotencyKey
        }
        await this.requestRepository.saveRequest(request);

        await this.publisher.publishRequest({
            id: id,
        });
    }
}