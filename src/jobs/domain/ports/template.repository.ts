import { Channel } from "../models/channel.model";
import { Template } from "../models/template.model";

export type TemplateDTO = Template;

export interface IFindByEventIdTemplateRepository {
    findByEventId(params: {
        eventId: string;
        channel: Channel;
        locale?: string;
    }): Promise<Template | null>;
}

export interface IFormatMessageTemplateRepository {
    formatMessageTemplate(params: {
        channel: Channel;
        template: Template;
        variables: Record<string, any>;
    }): Promise<string>;
}