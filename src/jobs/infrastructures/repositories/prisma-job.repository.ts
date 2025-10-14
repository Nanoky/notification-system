import { Injectable } from "@nestjs/common";
import { INotificationJobRepository, NotificationJobDTO } from "src/jobs/domain/ports/job.repository";
import { PrismaService } from "src/shared/services/prisma.service";
import { generateUUID } from "src/shared/utils/string";


@Injectable()
export class PrismaJobRepository implements INotificationJobRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    publishJob(params: { id: string; }): Promise<void> {
        console.info("publishJob", params);
        throw new Error("Method not implemented.");
    }
    generateJobId(): Promise<string> {
        return Promise.resolve(generateUUID());
    }
    generateJobIdempotencyKey(requestIdempotencyKey: string): Promise<string> {
        return new Promise((resolve) => {
            resolve(`${requestIdempotencyKey}-${generateUUID()}`);
        })
    }
    async createMany(params: NotificationJobDTO[]): Promise<void> {
        await this.prisma.$transaction(
            params.map((job) => {
                return this.prisma.notification_jobs.create({
                    data: {
                        id: job.id,
                        body: job.body,
                        channel: job.channel,
                        template_id: job.templateId,
                        recipient_id: job.recipientId,
                        status: job.status,
                        tenant_id: job.tenantId,
                        attempt_count: job.attemptCount,
                        next_attempt_at: job.nextAttemptAt,
                        idempotency_key: job.idempotencyKey,
                        created_at: job.createdAt
                    }
                })
            })
        );

        return;
    }
}