
export interface IEventAvailabilityRepository {
    isEventAvailable(params: {
        eventType: string,
        tenantId: string
    }): Promise<boolean>
}