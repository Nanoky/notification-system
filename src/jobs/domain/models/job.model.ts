import { Channel } from "./channel.model";

export type JobStatus = "PENDING" | "SENT" | "FAILED" | "RETRY" | "DLQ";

export interface NotificationJob {
    id: string;
    channel: Channel;
    templateId: string;
    recipientId: string;
    status: JobStatus;
    body: string;
    attemptCount: number;
    nextAttemptAt?: Date;
    idempotencyKey: string;
    createdAt: Date;
    updatedAt: Date;
}