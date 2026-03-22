import {StatusCodes} from "http-status-codes"
import { ApiError, ApiResponse } from "./interface"

export const createResponse = <T>(
  statusCode: StatusCodes,
  message: string,
  data: T | null = null
): ApiResponse<T> => ({
  success: statusCode === 200 || statusCode === 201,
  statusCode,
  message,
  data,
  timestamp: new Date().toISOString(),
})


export const createErrorResponse = (
    statusCode: StatusCodes,
    message: string,
    errors?: Record<string,string>
): ApiError => ({
    success: false,
    statusCode,
    message,
    data: null,
    timestamp: new Date().toISOString(),
    ...(errors && {errors}) 
}) 