import { StatusCodes } from "http-status-codes";
import { HttpMessage } from "./http-message";

export class AppError extends Error {
  public readonly statusCode: StatusCodes;
  public readonly errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
    errors?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = HttpMessage.VALIDATION_ERROR,
    errors?: Record<string, string>
  ) {
    super(message, StatusCodes.BAD_REQUEST, errors);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = HttpMessage.UNAUTHORIZED) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = HttpMessage.NOT_FOUND) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = "NotFoundError";
  }
}
