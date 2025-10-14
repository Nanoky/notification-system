/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Recipient } from "../models/recipient.model";

export type RecipientDTO = Recipient;

export interface IFindByIdRecipientRepository {
    findById(id: string): Promise<RecipientDTO | null>;
}

export interface IRecipientRepository extends IFindByIdRecipientRepository { }