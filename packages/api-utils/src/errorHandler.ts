import type { Request, Response, NextFunction } from "express";
import { AppError, HttpMessage, HttpStatus } from "@notifyflow/shared-types";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ── 1. Owntyped errors (AppError subclasses) ──────────────────────────
  // ConflictError, BadRequestError, UnauthorizedError etc.
  // These come from your services throwing typed errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      data: null,
      timestamp: new Date().toISOString(),
      ...(err.errors && { errors: err.errors }),
    });
  }

  // ── 2. Zod validation errors ─────────────────────────────────────────────────
  // These come from zod.parse() or zod.safeParse() throwing
  if (err instanceof ZodError) {
    // convert zod's error format into { field: "message" } shape
    const errors = err.issues.reduce<Record<string, string>>((acc, issue) => {
      const field = issue.path.join("."); // e.g. "email" or "address.city"
      acc[field] = issue.message;
      return acc;
    }, {});

    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Validation failed.",
      data: null,
      timestamp: new Date().toISOString(),
      errors,
    });
  }

  // ── 3. Prisma known errors ───────────────────────────────────────────────────
  // P2002 = unique constraint failed (e.g. duplicate email)
  // P2025 = record not found
  if (isPrismaError(err)) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "field";
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: `A record with this ${field} already exists.`,
        data: null,
        timestamp: new Date().toISOString(),
      });
    }

    if (err.code === "P2025") {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: "Record not found.",
        data: null,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ── 4. Unknown errors — never leak internals ─────────────────────────────────
  console.error("[Unhandled Error]", err);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "Something went wrong. Please try again later.",
    data: null,
    timestamp: new Date().toISOString(),
  });
};

// Prisma errors don't have a proper class to instanceof check
// so we check the shape instead
const isPrismaError = (
  err: any
): err is { code: string; meta?: Record<string, unknown> } => {
  return typeof err?.code === "string" && err.code.startsWith("P");
};
