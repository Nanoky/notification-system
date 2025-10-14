import { Injectable } from "@nestjs/common";
import { IRecipientRepository, RecipientDTO } from "src/jobs/domain/ports/recipient.repository";
import { PrismaService } from "src/shared/services/prisma.service";
import { isNullOrUndefined, jsonValueToRecord } from "src/shared/utils/common";
import { ChannelMapper } from "../mappers/channel.mapper";

@Injectable()
export class PrismaRecipientRepository implements IRecipientRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly channelMapper: ChannelMapper
    ) { }
    async findById(id: string): Promise<RecipientDTO | null> {
        const recipient = await this.prisma.recipients.findUnique({
            where: {
                id: id
            },
            include: {
                recipient_channels: true
            }
        });

        if (isNullOrUndefined(recipient) || isNullOrUndefined(recipient.name)) {
            return null;
        }

        return {
            id: recipient.id,
            name: recipient.name,
            attributes: jsonValueToRecord(recipient.attributes),
            addresses: recipient.recipient_channels?.map((recipientChannel) => ({
                channel: this.channelMapper.toDomain(recipientChannel.channel),
                value: recipientChannel.address
            })) ?? [],
        }
    }
}