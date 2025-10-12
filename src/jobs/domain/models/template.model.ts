import { Channel } from "./channel.model";


export interface Template {
    id: string;
    eventId: string;
    channel: Channel;
    locale: string;
    version: number;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}