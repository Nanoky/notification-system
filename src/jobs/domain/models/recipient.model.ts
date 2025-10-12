import { Channel } from "./channel.model";


export interface Recipient {
    id: string;
    name: string;
    attributes: Record<string, any>;
    addresses: {
        channel: Channel;
        value: string;
    }[];
}