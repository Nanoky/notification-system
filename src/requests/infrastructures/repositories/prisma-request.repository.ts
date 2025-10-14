import { Injectable, Logger } from "@nestjs/common";
import { RequestStatus } from "src/requests/domain/models/request.model";
import { IRequestRepository, NotificationRequestDTO } from "src/requests/domain/ports/request.repository";
import { PrismaService } from "src/shared/services/prisma.service";
import { jsonValueToRecord } from "src/shared/utils/common";
import { generateUUID } from "src/shared/utils/string";


@Injectable()
export class PrismaRequestRepository implements IRequestRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async findById(id: string): Promise<NotificationRequestDTO | null> {
        const request = await this.prisma.notification_requests.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                tenant_id: true,
                event_id: true,
                event_type: true,
                payload: true,
                status: true,
                scheduled_at: true,
                priority: true,
                created_at: true,
                idempotency_key: true,
                events: true
            }
        });
        if (!request || !request.status || !request.idempotency_key) {
            return null;
        }
        return ({
            id: request.id,
            tenantId: request.tenant_id,
            eventId: request.event_id,
            eventType: request.event_type,
            recipients: [],
            payload: jsonValueToRecord(request.payload),
            status: request.status as RequestStatus,
            scheduledAt: request.scheduled_at ?? undefined,
            priority: request.priority ?? undefined,
            createdAt: request.created_at ?? new Date(),
            idempotencyKey: request.idempotency_key,
        })
    }
    generateRequestId(): Promise<string> {
        return Promise.resolve(generateUUID());
    }
    async saveRequest(dto: NotificationRequestDTO): Promise<void> {
        await this.prisma.notification_requests.create({
            data: {
                id: dto.id,
                tenant_id: dto.tenantId,
                event_id: dto.eventId,
                event_type: dto.eventType,
                payload: dto.payload,
                status: dto.status,
                scheduled_at: dto.scheduledAt,
                priority: dto.priority,
                idempotency_key: dto.idempotencyKey,
                created_at: dto.createdAt,
            }
        });
    }
    publishRequest(params: { id: string; recipients: string[] }): Promise<void> {
        Logger.log(`Publishing request ${params.id} for recipients ${JSON.stringify(params.recipients)}`);

        return Promise.resolve();
    }
    async findByIdempotencyKey(idempotencyKey: string): Promise<NotificationRequestDTO | null> {
        const request = await this.prisma.notification_requests.findUnique({
            where: {
                idempotency_key: idempotencyKey
            },
            select: {
                id: true,
                tenant_id: true,
                event_id: true,
                event_type: true,
                payload: true,
                status: true,
                scheduled_at: true,
                priority: true,
                created_at: true,
                idempotency_key: true,
                events: true
            }
        });

        if (!request || !request.status || !request.idempotency_key) {
            return null;
        }

        return {
            id: request.id,
            tenantId: request.tenant_id,
            eventId: request.event_id,
            eventType: request.event_type,
            recipients: [],
            payload: jsonValueToRecord(request.payload),
            status: request.status as RequestStatus,
            scheduledAt: request.scheduled_at ?? undefined,
            priority: request.priority ?? undefined,
            createdAt: request.created_at ?? new Date(),
            idempotencyKey: request.idempotency_key,
        }
    }
}