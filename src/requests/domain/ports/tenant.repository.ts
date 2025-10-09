
export interface TenantDTO {
    id: string
}
export interface IFindByIdTenantRepository {
    findById(id: string): Promise<TenantDTO | null>
}