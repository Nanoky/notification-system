import { Module } from "@nestjs/common";
import { RequestsController } from "./controller/request.controller";
import { CreateRequestUseCase } from "../usecases/create-request.usecase";
import { IFindByIdTenantRepository } from "../domain/ports/tenant.repository";
import { IFindByIdempotencyKeyRepository, IGenerateRequestIdRepository, IPublishRequestRepository, ISaveRequestRepository, } from "../domain/ports/request.repository";
import { IEventAvailabilityRepository } from "../domain/ports/event.repository";


@Module({
    providers: [
        {
            provide: CreateRequestUseCase,
            useFactory: (
                tenantRepository: IFindByIdTenantRepository,
                eventRepository: IEventAvailabilityRepository,
                notificationRepository: IFindByIdempotencyKeyRepository & ISaveRequestRepository & IGenerateRequestIdRepository,
                publisher: IPublishRequestRepository
            ) => {
                return new CreateRequestUseCase(
                    tenantRepository,
                    eventRepository,
                    notificationRepository,
                    publisher
                );
            },
        }
    ],
    controllers: [RequestsController],
})
export class RequestsModule { }