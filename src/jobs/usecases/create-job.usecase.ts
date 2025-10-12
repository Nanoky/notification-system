import { IFindByIdRequestRepository } from "src/requests/domain/ports/request.repository";
import { Executable } from "src/shared/core/executable.interface";
import { ValidationError } from "src/shared/errors/validation.error";
import { isNullOrUndefined } from "src/shared/utils/common";
import { IFindByEventIdRecipientRepository } from "../domain/ports/recipient.repository";
import { IFindByEventIdTemplateRepository, IFormatMessageTemplateRepository } from "../domain/ports/template.repository";
import { NotificationJob } from "../domain/models/job.model";
import { ICreateManyJobsRepository, IGenerateJobIdempotencyKeyRepository, IGenerateJobIdRepository, IPublishJobRepository } from "../domain/ports/job.repository";

export interface CreateJobUseCaseInput {
    requestId: string;
    recipients: string[]
}

export type CreateJobUseCaseOutput = void;

export class CreateJobUseCase implements Executable<CreateJobUseCaseInput, CreateJobUseCaseOutput> {
    constructor(
        private readonly requestRepository: IFindByIdRequestRepository,
        private readonly recipientRepository: IFindByEventIdRecipientRepository,
        private readonly templateRepository: IFindByEventIdTemplateRepository & IFormatMessageTemplateRepository,
        private readonly jobRepository: IGenerateJobIdRepository & IGenerateJobIdempotencyKeyRepository & ICreateManyJobsRepository & IPublishJobRepository
    ) { }
    async execute(params: CreateJobUseCaseInput): Promise<CreateJobUseCaseOutput> {
        const requestDTO = await this.requestRepository.findById(params.requestId);

        if (isNullOrUndefined(requestDTO)) {
            throw new ValidationError("Request not found")
        }

        if (requestDTO.status !== "PENDING") {
            throw new ValidationError("Request status is not PENDING")
        }

        const recipients = await this.recipientRepository.findByEventId(requestDTO.eventId);

        if (recipients.length === 0) {
            throw new ValidationError("No recipients found")
        }

        const jobs: NotificationJob[] = [];

        for (const recipient of recipients) {
            for (const address of recipient.addresses) {
                const template = await this.templateRepository.findByEventId({
                    eventId: requestDTO.eventId,
                    channel: address.channel,
                });

                if (isNullOrUndefined(template)) {
                    continue;
                }

                const jobId = await this.jobRepository.generateJobId();
                const idempotencyKey = await this.jobRepository.generateJobIdempotencyKey(requestDTO.idempotencyKey);

                const formattedMessage = await this.templateRepository.formatMessageTemplate({
                    channel: address.channel,
                    template: template,
                    variables: {
                        ...recipient.attributes,
                        ...requestDTO.payload
                    },
                });

                const job: NotificationJob = {
                    id: jobId,
                    channel: address.channel,
                    templateId: template.id,
                    recipientId: recipient.id,
                    status: "PENDING",
                    body: formattedMessage,
                    attemptCount: 0,
                    idempotencyKey: idempotencyKey,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                jobs.push(job);
            }
        }

        await this.jobRepository.createMany(jobs);

        for (const job of jobs) {
            await this.jobRepository.publishJob({
                id: job.id,
            });
        }
    }
}