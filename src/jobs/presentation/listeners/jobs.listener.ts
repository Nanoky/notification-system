import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CreateJobUseCase } from "src/jobs/usecases/create-job.usecase";
import { BusinessEvents } from "src/shared/core/business-events";
import { HandleRequestDto } from "../dto/handle-request.dto";

@Injectable()
export class JobsListener {
    constructor(
        private readonly createJobUsecase: CreateJobUseCase
    ) { }

    @OnEvent(BusinessEvents.request_created)
    async handleRequestCreated(payload: HandleRequestDto) {
        await this.createJobUsecase.execute({
            recipients: payload.recipients,
            requestId: payload.requestId
        });
    }
}