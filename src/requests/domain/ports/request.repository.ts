import { NotificationRequest } from "../models/request.model";

export type NotificationRequestDTO = NotificationRequest;

export interface IGenerateRequestIdRepository {
    generateRequestId(): Promise<string>
}
export interface ISaveRequestRepository {
    saveRequest(dto: NotificationRequestDTO): Promise<void>
}

export interface IPublishRequestRepository {
    publishRequest(params: {
        id: string;
    }): Promise<void>
}

export interface IFindByIdempotencyKeyRepository {
    findByIdempotencyKey(idempotencyKey: string): Promise<NotificationRequestDTO | null>
}

export interface IRequestRepository extends IGenerateRequestIdRepository, ISaveRequestRepository, IPublishRequestRepository, IFindByIdempotencyKeyRepository { }