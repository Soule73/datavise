export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: number;
    details?: any;
  };
  timestamp?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    [key: string]: any;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    prev?: string | null;
  };
  timestamp?: string;
}

export interface ApiData<T> {
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
