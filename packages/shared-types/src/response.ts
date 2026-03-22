import { StatusCodes } from "http-status-codes";
import { createResponse, createErrorResponse } from "./http-modules";
import { HttpMessage } from "./http-message";

export const Response = {
  Ok: <T>(data: T, message = HttpMessage.LOGIN_SUCCESS) =>
    createResponse(StatusCodes.OK, message, data),

  created: <T>(data: T, message: string) =>
    createResponse(StatusCodes.CREATED, message, data),

  accepted: <T>(data: T, message: string) =>
    createResponse(StatusCodes.ACCEPTED, message, data),

  noContent: (message: string) =>
    createResponse(StatusCodes.NO_CONTENT, message, null),

  badRequest: (
    message = HttpMessage.VALIDATION_ERROR,
    errors?: Record<string, string>
  ) => createErrorResponse(StatusCodes.BAD_REQUEST, message, errors),

  unauthorized: (message = HttpMessage.UNAUTHORIZED) =>
    createErrorResponse(StatusCodes.UNAUTHORIZED, message),

  forbidden: (message = HttpMessage.FORBIDDEN) =>
    createErrorResponse(StatusCodes.FORBIDDEN, message),

  notFound: (message = HttpMessage.NOT_FOUND) =>
    createErrorResponse(StatusCodes.NOT_FOUND, message),

  conflict: (message: string) =>
    createErrorResponse(StatusCodes.CONFLICT, message),

  tooManyRequests: (message = HttpMessage.TOO_MANY_REQUESTS) =>
    createErrorResponse(StatusCodes.TOO_MANY_REQUESTS, message),

  internalError: (message = HttpMessage.INTERNAL_ERROR) =>
    createErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, message),
};
