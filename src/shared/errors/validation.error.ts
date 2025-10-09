import { DomainError } from "./domain.error";

export class ValidationError extends DomainError {
    readonly code = 'VALIDATION_ERROR';
    constructor(public readonly details: string) {
        super(`Invalid input: ${details}`);
    }
}