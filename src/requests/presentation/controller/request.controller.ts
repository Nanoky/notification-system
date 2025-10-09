
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateRequestUseCase } from "src/requests/usecases/create-request.usecase";
import { CreateRequestDto } from "../dto/create-request.dto";


@ApiTags("Notifications")
@Controller("notifications")
export class RequestsController {
    constructor(
        private readonly createUsecase: CreateRequestUseCase
    ) { }

    @Post()
    @ApiBody({ type: CreateRequestDto })
    async create(@Body() body: CreateRequestDto): Promise<void> {
        await this.createUsecase.execute(body);
    }
}