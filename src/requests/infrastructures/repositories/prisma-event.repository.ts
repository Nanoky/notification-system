import { Injectable } from "@nestjs/common";
import { EventDTO, IFindByTypeEventRepository } from "src/requests/domain/ports/event.repository";
import { PrismaService } from "src/shared/services/prisma.service";


@Injectable()
export class PrismaEventRepository implements IFindByTypeEventRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findByType(params: { eventType: string; tenantId: string; }): Promise<EventDTO | null> {
        const event = await this.prisma.events.findFirst({
            where: {
                event_type: params.eventType,
                tenant_id: params.tenantId
            }
        })
        if (!event) {
            return null
        }
        return {
            id: event.id,
            eventType: event.event_type,
            tenantId: event.tenant_id
        }
    }
}