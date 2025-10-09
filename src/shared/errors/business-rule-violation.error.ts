import { DomainError } from "./domain.error";

export class BusinessRuleViolationError extends DomainError {
    readonly code = 'BUSINESS_RULE_VIOLATION';
    constructor(message: string) {
        super(message);
    }
}