import { Injectable } from "@nestjs/common";
import { IFindByIdTenantRepository, TenantDTO } from "src/requests/domain/ports/tenant.repository";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
export class PrismaTenantRepository implements IFindByIdTenantRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findById(id: string): Promise<TenantDTO | null> {
        const tenant = await this.prisma.tenants.findUnique({
            where: {
                id: id
            }
        })
        if (!tenant) {
            return null
        }
        return {
            id: tenant.id
        }
    }
}