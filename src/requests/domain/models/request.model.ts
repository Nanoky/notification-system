
export type RequestStatus = 'PENDING' | 'PROCESSING' | 'IN_PROGRESS' | 'PARTIALLY_SENT' | 'SENT' | 'FAILED';

export interface NotificationRequest {
    id: string;
    tenantId: string;
    eventId: string;
    eventType: string;
    recipients: string[];
    payload: Record<string, any>;
    status: RequestStatus;
    scheduledAt?: Date;
    priority?: number;
    createdAt: Date;
    idempotencyKey: string;
}