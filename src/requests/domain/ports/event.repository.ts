
export interface EventDTO {
    id: string
    eventType: string
    tenantId: string
}

export interface IEventAvailabilityRepository {
    isEventAvailable(params: {
        eventType: string,
        tenantId: string
    }): Promise<boolean>
}

export interface IFindByTypeEventRepository {
    findByType(params: {
        eventType: string,
        tenantId: string
    }): Promise<EventDTO | null>
}