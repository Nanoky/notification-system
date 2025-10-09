import { Module } from "@nestjs/common";
import { RequestsController } from "./controller/request.controller";
import { CreateRequestUseCase } from "../usecases/create-request.usecase";
import { IFindByIdTenantRepository } from "../domain/ports/tenant.repository";
import { IGenerateRequestIdRepository, IIsEvantAvailableRepository, IPublishRequestRepository, ISaveRequestRepository, } from "../domain/ports/request.repository";


@Module({
    providers: [
        {
            provide: CreateRequestUseCase,
            useFactory: (
                tenantRepository: IFindByIdTenantRepository,
                notificationRepository: IIsEvantAvailableRepository & ISaveRequestRepository & IGenerateRequestIdRepository,
                publisher: IPublishRequestRepository
            ) => {
                return new CreateRequestUseCase(
                    tenantRepository,
                    notificationRepository,
                    publisher
                );
            },
        }
    ],
    controllers: [RequestsController],
})
export class RequestsModule { }