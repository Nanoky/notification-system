import { Executable } from "src/shared/core/executable.interface";
import { ValidationError } from "src/shared/errors/validation.error";
import { IGenerateRequestIdRepository, IIsEvantAvailableRepository, IPublishRequestRepository, ISaveRequestRepository } from "../domain/ports/request.repository";
import { IFindByIdTenantRepository } from "../domain/ports/tenant.repository";
import { isNullOrUndefined } from "src/shared/utils/common";


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
        private readonly requestRepository: IIsEvantAvailableRepository & ISaveRequestRepository & IGenerateRequestIdRepository,
        private readonly publisher: IPublishRequestRepository
    ) { }
    async execute(params: CreateRequestUseCaseInput): Promise<void> {
        const tenantDTO = await this.tenantRepository.findById(params.tenantId);
        if (isNullOrUndefined(tenantDTO)) {
            throw new ValidationError("Tenant not found")
        }

        const isEventAvailable = await this.requestRepository.isEventAvailable(params.eventType);
        if (!isEventAvailable) {
            throw new ValidationError("Event type not available")
        }

        const id = await this.requestRepository.generateRequestId();
        await this.requestRepository.saveRequest({
            id: id,
            tenantId: params.tenantId,
            eventType: params.eventType,
            recipients: params.recipients,
            payload: params.payload,
            scheduledAt: params.scheduledAt,
            priority: params.priority,
            idempotencyKey: params.idempotencyKey
        });

        await this.publisher.publishRequest({
            id: id,
        });
    }
}