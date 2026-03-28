import { asyncHanlder, Send } from "@notifyflow/api-utils";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { Request, Response, NextFunction } from "express";
import { HttpMessage, HttpStatus } from "@notifyflow/shared-types";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = asyncHanlder(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = registerSchema.parse(req.body);

      const result = await this.authService.register(body);

      Send(res, result, {
        statusCode: HttpStatus.CREATED,
        message: HttpMessage.REGISTER_SUCCESS,
      });
    }
  );

  login = asyncHanlder(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = loginSchema.parse(req.body);

      const result = await this.authService.login(body);

      Send(res, result, {
        message: HttpMessage.LOGIN_SUCCESS,
      });
    }
  );

  rotateKey = asyncHanlder(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.authService.rotateApiKey(req.user!?.tenantId);

      Send(
        res,
        { apiKey: result.apiKey },
        {
          message: HttpMessage.ROTATE_KEY_SUCCESS,
        }
      );
    }
  );
}
