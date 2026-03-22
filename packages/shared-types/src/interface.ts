import { StatusCodes } from "http-status-codes";

export interface ApiResponse<T = null>{
    success: boolean,
    statusCode: StatusCodes,
    message: string,
    data: T | null,
    timestamp: string
}

export interface PaginatedData<T>{
    items: T[],
    total: number,
    limit: number,
    offset: number
}

export interface ApiError{
    success: false,
    statusCode: StatusCodes,
    message: string,
    data: null,
    timestamp: string,
    errors?: Record<string,string>
}


export interface Tenant {
  id: string;
  name: string;
  email: string;
  hashedApiKey: string;
  createdAt: Date;
}

export interface NotificationPayload {
  channel: 'email' | 'sms' | 'webhook';
  to: string;
  subject?: string;
  body: string;
  idempotencyKey?: string;
}

export type NotificationStatus = 'queued' | 'processing' | 'delivered' | 'failed' | 'dead';