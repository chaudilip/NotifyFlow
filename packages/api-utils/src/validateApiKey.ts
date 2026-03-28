import type { Request, Response, NextFunction } from "express";
import { HttpMessage, UnauthorizedError } from "@notifyflow/shared-types";
import { hashApiKey } from "./hashApiKey";

interface Dependencies {
  prisma: {
    apiKey: {
      findFirst: (args: any) => Promise<any>;
    };
  };
  redis: {
    get: (key: string) => Promise<string | null>;
    setex: (key: string, ttl: number, value: string) => Promise<any>;
  };
}

const CACHE_TTL = 300; // 5 minutes

// factory function - returns the actual middleware
// this way prisma and redis are injected rather than imported directly
export const createValidateApiKey = (deps: Dependencies) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawKey = req.headers["x-api-key"] as string | undefined;

      if (!rawKey) {
        throw new UnauthorizedError(HttpMessage.UNAUTHORIZED);
      }

      const keyHash = hashApiKey(rawKey);

      const cacheKey = `apikey:${keyHash}`;

      const cached = await deps.redis.get(cacheKey);

      if (cached) {
        req.tenant = JSON.parse(cached);
        return next();
      }

      // Not in cache then check db
      const apiKey = await deps.prisma.apiKey.findFirst({
        where: {
          keyHash: true,
          isActive: true,
          include: {
            tenant: true,
          },
        },
      });

      // Key not found or deactivated
      if (!apiKey || !apiKey.tenant) {
        throw new UnauthorizedError(HttpMessage.INVALID_API_KEY);
      }

      //build tenant object to attach to request
      const tenantData = {
        id: apiKey.tenant.id,
        name: apiKey.tenant.name,
        email: apiKey.tenant.email,
      };

      //cache for next request — avoids DB hit for 5 minutes
      await deps.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(tenantData));

      req.tenant = tenantData;
      next();
    } catch (error) {
      next(error);
    }
  };
};
