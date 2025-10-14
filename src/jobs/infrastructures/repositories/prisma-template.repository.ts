import { Channel } from "src/jobs/domain/models/channel.model";
import { Template } from "src/jobs/domain/models/template.model";
import { ITemplateRepository } from "src/jobs/domain/ports/template.repository";
import { PrismaService } from "src/shared/services/prisma.service";
import { isNullOrUndefined } from "src/shared/utils/common";
import { ChannelMapper } from "../mappers/channel.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaTemplateRepository implements ITemplateRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly channelMapper: ChannelMapper
    ) { }
    async findByEventId(params: { eventId: string; channel: Channel; locale?: string; }): Promise<Template | null> {
        const template = await this.prisma.templates.findFirst({
            where: {
                event_id: params.eventId,
                channel: params.channel,
                locale: params.locale
            }
        });

        if (
            isNullOrUndefined(template) ||
            isNullOrUndefined(template.subject) ||
            isNullOrUndefined(template.active) ||
            isNullOrUndefined(template.created_at) ||
            isNullOrUndefined(template.updated_at)
        ) {
            return null;
        }

        return {
            id: template.id,
            eventId: template.event_id,
            channel: this.channelMapper.toDomain(template.channel),
            locale: template.locale,
            version: template.version,
            name: template.name,
            subject: template.subject,
            body: template.body,
            variables: template.variables,
            isActive: template.active,
            createdAt: template.created_at,
            updatedAt: template.updated_at
        }
    }
    formatMessageTemplate(params: { channel: Channel; template: Template; variables: Record<string, any>; }): Promise<string> {

        return new Promise((resolve) => {
            let message = params.template.body;
            for (const variable of params.template.variables) {
                const value = (params.variables[variable] as string) ?? "";
                message = message.replace(`{${variable}}`, value);
            }
            resolve(message);
        });
    }
}