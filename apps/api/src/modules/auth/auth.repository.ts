import { PrismaClient } from "@notifyflow/database";

export class AuthRepositroy {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findTenantByEmail(email: string) {
    return this.prisma.tenant.findUnique({
      where: { email },
    });
  }

  async findTenantById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  async createTenant(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.tenant.create({
      data,
    });
  }

  async createApiKey(data: {
    tenantId: string;
    keyHash: string;
    isActive: boolean;
  }) {
    return this.prisma.apiKey.create({ data });
  }

  async deactivateAllApiKeys(tenantId: string) {
    return this.prisma.apiKey.updateMany({
      where: { tenantId, isActive: true },
      data: { isActive: false },
    });
  }
}
