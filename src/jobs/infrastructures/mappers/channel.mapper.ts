import { Injectable } from "@nestjs/common";
import { Channel } from "src/jobs/domain/models/channel.model";

@Injectable()
export class ChannelMapper {
    toDomain(channel: string): Channel {
        switch (channel) {
            case "sms":
                return "sms";
            case "push":
                return "push";
            case "slack":
                return "slack";
            default:
                throw new Error(`Invalid channel: ${channel}`);
        }
    }

    toPersistence(channel: Channel): string {
        switch (channel) {
            case "sms":
                return "sms";
            case "push":
                return "push";
            case "slack":
                return "slack";
        }
    }
}