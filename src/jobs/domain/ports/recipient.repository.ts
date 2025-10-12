import { Recipient } from "../models/recipient.model";

export type RecipientDTO = Recipient;

export interface IFindByEventIdRecipientRepository {
    findByEventId(eventId: string): Promise<RecipientDTO[]>;
}