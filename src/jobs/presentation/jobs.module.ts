import { Module } from "@nestjs/common";
import { JobsListener } from "./listeners/jobs.listener";
import { ChannelMapper } from "../infrastructures/mappers/channel.mapper";
import { PrismaJobRepository } from "../infrastructures/repositories/prisma-job.repository";
import { PrismaRecipientRepository } from "../infrastructures/repositories/prisma-recipient.repository";
import { PrismaTemplateRepository } from "../infrastructures/repositories/prisma-template.repository";
import { CreateJobUseCase } from "../usecases/create-job.usecase";
import { PrismaRequestRepository } from "src/requests/infrastructures/repositories/prisma-request.repository";
import { PrismaService } from "src/shared/services/prisma.service";


@Module({
    imports: [
        PrismaRequestRepository,
    ],
    controllers: [],
    providers: [
        PrismaService,
        ChannelMapper,
        PrismaJobRepository,
        PrismaRecipientRepository,
        PrismaTemplateRepository,
        {
            provide: CreateJobUseCase,
            useFactory: (
                requestRepository: PrismaRequestRepository,
                jobRepository: PrismaJobRepository, 
                recipientRepository: PrismaRecipientRepository, 
                templateRepository: PrismaTemplateRepository
            ) => {
                return new CreateJobUseCase(
                    requestRepository,
                    recipientRepository,
                    templateRepository,
                    jobRepository,
                );
            },
            inject: [PrismaRequestRepository, PrismaJobRepository, PrismaRecipientRepository, PrismaTemplateRepository]
        },
        JobsListener,
    ],
    exports: []
})
export class JobsModule { }