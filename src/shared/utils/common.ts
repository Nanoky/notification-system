import { JsonValue } from "@prisma/client/runtime/library";

export function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined;
}


export function jsonValueToRecord(json: JsonValue): Record<string, any> {
    const result: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = JSON.parse(JSON.stringify(json))
    for (const [key, value] of Object.entries(data)) {
        result[key] = value;
    }
    return result;
}