import { Module } from "@nestjs/common";
import { RequestsController } from "./controller/request.controller";
import { CreateRequestUseCase } from "../usecases/create-request.usecase";
import { PrismaRequestRepository } from "../infrastructures/repositories/prisma-request.repository";
import { PrismaTenantRepository } from "../infrastructures/repositories/prisma-tenant.repository";
import { PrismaEventRepository } from "../infrastructures/repositories/prisma-event.repository";
import { PrismaService } from "src/shared/services/prisma.service";


@Module({
    providers: [
        PrismaService,
        PrismaRequestRepository,
        PrismaTenantRepository,
        PrismaEventRepository,
        {
            provide: CreateRequestUseCase,
            useFactory: (
                tenantRepository: PrismaTenantRepository,
                eventRepository: PrismaEventRepository,
                notificationRepository: PrismaRequestRepository,
            ) => {
                return new CreateRequestUseCase(
                    tenantRepository,
                    eventRepository,
                    notificationRepository,
                );
            },
            inject: [PrismaTenantRepository, PrismaEventRepository, PrismaRequestRepository],
        }
    ],
    controllers: [RequestsController],
    exports: [PrismaRequestRepository]
})
export class RequestsModule { }