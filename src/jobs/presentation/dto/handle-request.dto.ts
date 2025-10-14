import { ApiProperty } from "@nestjs/swagger";

export class HandleRequestDto {
    @ApiProperty()
    requestId: string;
    @ApiProperty()
    recipients: string[] 
}