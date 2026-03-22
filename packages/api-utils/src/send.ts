import type { Response } from "express";
import { HttpStatus } from "@notifyflow/shared-types";

interface SendOptions {
  statusCode?: number;
  message?: string;
}

export const Send = <T>(res: Response, data: T, options: SendOptions = {}) => {
  const statusCode = options.statusCode ?? HttpStatus.OK;
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message: options.message ?? "Success.",
    data,
    timestamp: new Date().toISOString(),
  });
};
