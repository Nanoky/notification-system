

export interface IIsEvantAvailableRepository {
    isEventAvailable(eventType: string): Promise<boolean>
}

export interface IGenerateRequestIdRepository {
    generateRequestId(): Promise<string>
}
export interface ISaveRequestRepository {
    saveRequest(params: {
        id: string;
        tenantId: string;
        eventType: string;
        recipients: string[];
        payload: Record<string, any>;
        scheduledAt?: Date;
        priority?: number;
        idempotencyKey: string;
    }): Promise<void>
}

export interface IPublishRequestRepository {
    publishRequest(params: {
        id: string;
    }): Promise<void>
}

export interface IRequestRepository extends IIsEvantAvailableRepository, IGenerateRequestIdRepository, ISaveRequestRepository, IPublishRequestRepository { }