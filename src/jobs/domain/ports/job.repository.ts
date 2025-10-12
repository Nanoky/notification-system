import { NotificationJob } from "../models/job.model";

export type NotificationJobDTO = NotificationJob;

export interface IPublishJobRepository {
    publishJob(params: {
        id: string;
    }): Promise<void>
}

export interface IGenerateJobIdRepository {
    generateJobId(): Promise<string>
}

export interface IGenerateJobIdempotencyKeyRepository {
    generateJobIdempotencyKey(requestIdempotencyKey: string): Promise<string>
}

export interface ICreateManyJobsRepository {
    createMany(params: NotificationJobDTO[]): Promise<void>
}