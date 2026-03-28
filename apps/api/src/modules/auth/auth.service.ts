import { AuthRepositroy } from "./auth.repository";
import {
  ConflictError,
  LoginInput,
  LoginResult,
  HttpMessage,
  RegisterInput,
  RegisterResult,
  UnauthorizedError,
} from "@notifyflow/shared-types";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { apiEnv } from "@notifyflow/env";
import { hashApiKey } from "@notifyflow/api-utils";

export class AuthService {
  authRepository: AuthRepositroy;

  constructor(authRepository: AuthRepositroy) {
    this.authRepository = authRepository;
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    // check email not already taken
    const existing = await this.authRepository.findTenantByEmail(input.email);

    // check email not already taken
    if (existing) throw new ConflictError(HttpMessage.EMAIL_ALREADY_EXISTS);

    const passwordHash = await bcrypt.hash(input.password, 10);

    const tenant = await this.authRepository.createTenant({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const { raw, hashed } = this.generateApiKey();
    await this.authRepository.createApiKey({
      tenantId: tenant.id,
      keyHash: hashed,
      isActive: false,
    });

    return {
      apiKey: raw,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
      },
    };
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const tenant = await this.authRepository.findTenantByEmail(input.email);

    if (!tenant) throw new UnauthorizedError(HttpMessage.INVALID_CREDENTIALS);

    const valid = await bcrypt.compare(input.password, tenant.passwordHash);

    if (!valid) throw new UnauthorizedError(HttpMessage.INVALID_CREDENTIALS);

    const token = jwt.sign(
      { tenantId: tenant.id, email: tenant.email },
      apiEnv.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
      },
    };
  }

  async rotateApiKey(tenantId: string) {
    const { raw, hashed } = this.generateApiKey();

    await this.authRepository.deactivateAllApiKeys(tenantId);
    await this.authRepository.createApiKey({
      tenantId,
      keyHash: hashed,
      isActive: true,
    });

    return { apiKey: raw };
  }

  private generateApiKey(): { raw: string; hashed: string } {
    const raw = `nf_live_${crypto.randomBytes(24).toString("hex")}`;
    const hashed = hashApiKey(raw);
    return { raw, hashed };
  }
}
